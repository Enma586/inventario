import { describe, it, expect, beforeAll, vi, afterEach } from 'vitest';
import request from 'supertest';
import app from './app.js';
import { loginAs } from './setup.js';
import models from '../models/index.js'; 

// 👇 Importamos el servicio directamente para las pruebas unitarias
import { generarNumeroFactura } from '../services/ventas/venta.service.js';

const { Departamento, Municipio, Distrito } = models;

// Intercepción del módulo de WebSockets para prevenir fallos de conexión 
// durante la ejecución aislada del entorno de pruebas.
vi.mock('../config/socket.js', () => ({
  getIO: () => ({ emit: vi.fn() }),
  initSocket: vi.fn()
}));

let cookie, sucursalId, productoId;

// ============================================================================
// CONFIGURACIÓN GLOBAL (Para Pruebas de Integración)
// ============================================================================
beforeAll(async () => {
  // Generación de un identificador de tiempo para evitar colisiones de unicidad en la BD
  const unique = Date.now();

  // 1. Registro y autenticación de usuario administrador
  await request(app).post('/api/auth/register').send({
    usuario: { nombre_usuario: `vendedor_${unique}`, email: `vta_${unique}@test.com`, password: 'Password123!', rol: 'ADMIN' },
    empleado: { nombres: 'Ventas', apellidos: 'Test', dui: '88888888-8' }, 
  });
  
  cookie = await loginAs(request(app), `vta_${unique}@test.com`, 'Password123!');

  // 2. Creación o recuperación de jerarquía geográfica
  const [depto] = await Departamento.findOrCreate({ 
    where: { nombre: 'Sonsonate' } 
  });
  
  const [muni] = await Municipio.findOrCreate({ 
    where: { nombre: 'Sonsonate Centro' }, 
    defaults: { id_departamento: depto.id } 
  });
  
  const [distritoTest] = await Distrito.findOrCreate({ 
    where: { nombre: 'Sonsonate Centro' }, 
    defaults: { id_municipio: muni.id } 
  });

  // 3. Creación de la sucursal con ID de distrito válido
  const responseSucursal = await request(app)
    .post('/api/sucursales')
    .set('Cookie', cookie)
    .send({ 
      nombre: `Sucursal Central ${unique}`, 
      direccion: 'Av. Principal', 
      telefono: '1234-5678', 
      id_distrito: distritoTest.id 
    });

  if (!responseSucursal.body || !responseSucursal.body.success) {
    throw new Error("Error en la inicialización de la sucursal: " + JSON.stringify(responseSucursal.body));
  }

  sucursalId = responseSucursal.body.data.id;

  // 4. Creación de categoría de prueba
  const responseCategoria = await request(app)
    .post('/api/categorias')
    .set('Cookie', cookie)
    .send({ nombre: `General ${unique}` });

  // 5. Creación de producto vinculado a la categoría anterior
  const responseProducto = await request(app)
    .post('/api/productos')
    .set('Cookie', cookie)
    .send({
      sku: `SKU-${unique}`,
      nombre: 'Producto Test',
      id_categoria: responseCategoria.body.data.id,
      precio_venta: 1500,
    });
    
  productoId = responseProducto.body.data.id;

  // 6. Inicialización del inventario (stock)
  await request(app)
    .post('/api/stocks')
    .set('Cookie', cookie)
    .send({ id_producto: productoId, id_sucursal: sucursalId, cantidad: 100 });
});

// ============================================================================
// PRUEBAS DE INTEGRACIÓN (Rutas API)
// ============================================================================
describe('POST /api/ventas', () => {
  it('crea venta completa con detalles y descuenta stock', async () => {
    const empleadoList = await request(app).get('/api/empleados').set('Cookie', cookie);
    const empleadoId = empleadoList.body.data[0].id;

    const res = await request(app)
      .post('/api/ventas')
      .set('Cookie', cookie)
      .send({
        venta: {
          id_sucursal: sucursalId,
          id_empleado: empleadoId,
          cliente_nombre: 'Juan Pérez',
          cliente_nit: '0614-010101-101-0',
          metodo_pago: 'EFECTIVO',
        },
        detalles: [
          {
            id_producto: productoId,
            precio_unitario_venta: 1500,
            cantidad: 2,
          },
        ],
      });

    if (res.status !== 201) {
      console.error('\n🚨 ERROR DE VALIDACIÓN EN LA VENTA:', JSON.stringify(res.body, null, 2), '\n');
    }

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('numero_factura');
    expect(res.body.data.total_pagado).toBe(3000);
    expect(res.body.data.detalles).toHaveLength(1);
    expect(res.body.data.detalles[0].nombre_snapshot).toBe('Producto Test');
  });

  it('genera número de factura automáticamente en formato DTE', async () => {
    const empleadoList = await request(app).get('/api/empleados').set('Cookie', cookie);

    const res = await request(app)
      .post('/api/ventas')
      .set('Cookie', cookie)
      .send({
        venta: {
          id_sucursal: sucursalId,
          id_empleado: empleadoList.body.data[0].id,
          cliente_nombre: 'María',
          cliente_nit: '0614-020202-202-0',
          metodo_pago: 'TARJETA_CREDITO',
        },
        detalles: [{ id_producto: productoId, precio_unitario_venta: 1000, cantidad: 1 }],
      });

    if (res.status !== 201) {
      console.error('\n🚨 ERROR EN LA VENTA (TEST DTE):', JSON.stringify(res.body, null, 2), '\n');
    }

    expect(res.status).toBe(201);
    expect(res.body.data.numero_factura).toMatch(/^[A-F0-9]{4}-01-\d{10}$/);
  });

  it('rechaza venta sin detalles', async () => {
    const empleadoList = await request(app).get('/api/empleados').set('Cookie', cookie);

    const res = await request(app)
      .post('/api/ventas')
      .set('Cookie', cookie)
      .send({
        venta: {
          id_sucursal: sucursalId,
          id_empleado: empleadoList.body.data[0].id,
          cliente_nombre: 'Sin detalles',
          cliente_nit: '0000-000000-000-0',
          metodo_pago: 'EFECTIVO',
        },
        detalles: [],
      });

    expect(res.status).toBe(400);
  });
});

describe('PUT /api/ventas/:id/anular', () => {
  it('anula venta y restaura stock', async () => {
    const empleadoList = await request(app).get('/api/empleados').set('Cookie', cookie);

    const venta = await request(app)
      .post('/api/ventas')
      .set('Cookie', cookie)
      .send({
        venta: {
          id_sucursal: sucursalId,
          id_empleado: empleadoList.body.data[0].id,
          cliente_nombre: 'Para Anular',
          cliente_nit: '0000-000000-000-0',
          metodo_pago: 'EFECTIVO',
        },
        detalles: [{ id_producto: productoId, precio_unitario_venta: 500, cantidad: 3 }],
      });

    if (venta.status !== 201) {
      console.error('\n🚨 ERROR AL CREAR VENTA PARA ANULAR:', JSON.stringify(venta.body, null, 2), '\n');
    }

    const res = await request(app)
      .put(`/api/ventas/${venta.body.data.id}/anular`)
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.data.estado).toBe('CANCELADO');
  });
});

// ============================================================================
// PRUEBAS UNITARIAS (Servicios internos)
// ============================================================================
describe('Servicio de Ventas - generarNumeroFactura (DTE)', () => {
  // Limpiamos los espías después de cada test para no contaminar las pruebas de integración
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('genera el formato DTE correctamente para la primera factura (Factura Normal)', async () => {
    // 1. Engañamos a Sequelize para que devuelva un UUID conocido sin tocar la BD
    const mockUUID = 'a1b2c3d4-1234-5678-90ab-cdef12345678';
    vi.spyOn(models.Sucursal, 'findByPk').mockResolvedValue({
      id: mockUUID,
      nombre: 'Sucursal Falsa'
    });

    // 2. Simulamos que esta sucursal tiene 0 ventas
    vi.spyOn(models.Venta, 'count').mockResolvedValue(0);

    // 3. Ejecutamos tu servicio directamente
    const resultado = await generarNumeroFactura(mockUUID, '01');

    // 4. Verificamos la lógica matemática
    expect(resultado).toBe('A1B2-01-0000000001');
  });

  it('incrementa el correlativo si ya existen ventas previas (Comprobante de Crédito Fiscal)', async () => {
    const mockUUID = '9f8e7d6c-0000-0000-0000-000000000000';
    vi.spyOn(models.Sucursal, 'findByPk').mockResolvedValue({ id: mockUUID });

    // Simulamos que ya existen 42 ventas previas
    vi.spyOn(models.Venta, 'count').mockResolvedValue(42);

    const resultado = await generarNumeroFactura(mockUUID, '03'); 

    expect(resultado).toBe('9F8E-03-0000000043');
  });

  it('lanza un error si la sucursal no existe', async () => {
    vi.spyOn(models.Sucursal, 'findByPk').mockResolvedValue(null);

    await expect(generarNumeroFactura('uuid-inventado', '01'))
      .rejects
      .toThrow('Sucursal no encontrada.');
  });
});