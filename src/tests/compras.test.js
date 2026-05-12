import { describe, it, expect, beforeAll, vi } from 'vitest';
import request from 'supertest';
import app from './app.js';
import { loginAs } from './setup.js';
import models from '../models/index.js';

const { Departamento, Municipio, Distrito } = models;

vi.mock('../config/socket.js', () => ({
  getIO: () => ({ emit: vi.fn() }),
  initSocket: vi.fn()
}));

let cookie, sucursalId, proveedorId, productoId, empleadoId;
let compraPutId, compraCancelId;

const generateDui = () => `${Math.floor(10000000 + Math.random() * 90000000)}-${Math.floor(Math.random() * 10)}`;

beforeAll(async () => {
  const unique = Date.now();
  const email = `comp_${unique}@test.com`;

  const reg = await request(app).post('/api/auth/register').send({
    usuario: { nombre_usuario: `comp_${unique}`, email: email, password: 'Password123!', rol: 'ADMIN' },
    empleado: { nombres: 'Comp', apellidos: 'Test', dui: generateDui() },
  });

  if (!reg.body || !reg.body.success) {
    throw new Error("\nError en el registro de usuario para compras:\n" + JSON.stringify(reg.body, null, 2) + "\n");
  }

  cookie = await loginAs(request(app), email, 'Password123!');
  empleadoId = reg.body.data.empleado.id;

  const [depto] = await Departamento.findOrCreate({ where: { nombre: 'Sonsonate' } });
  const [muni] = await Municipio.findOrCreate({ where: { nombre: 'Sonsonate Centro' }, defaults: { id_departamento: depto.id } });
  const [dist] = await Distrito.findOrCreate({ where: { nombre: 'Sonsonate Centro' }, defaults: { id_municipio: muni.id } });

  const s = await request(app).post('/api/sucursales').set('Cookie', cookie).send({ 
    nombre: `Bodega Compras ${unique}`, direccion: 'Calle Compras', id_distrito: dist.id 
  });
  sucursalId = s.body.data.id;

  const prov = await request(app).post('/api/proveedores').set('Cookie', cookie).send({ 
    nombre: `Mayorista S.A. ${unique}` 
  });
  proveedorId = prov.body.data.id;

  const cat = await request(app).post('/api/categorias').set('Cookie', cookie).send({ 
    nombre: `CompCat ${unique}` 
  });

  const prod = await request(app).post('/api/productos').set('Cookie', cookie).send({
    sku: `COMP-${unique}`,
    nombre: 'Producto Compra',
    id_categoria: cat.body.data.id,
    costo_compra: 200,
    precio_venta: 400,
  });
  productoId = prod.body.data.id;

  const resGet = await request(app).post('/api/compras').set('Cookie', cookie).send({
    compra: { id_proveedor: proveedorId, id_sucursal: sucursalId, id_empleado: empleadoId },
    detalles: [{ id_producto: productoId, cantidad: 5, costo_unitario: 50 }],
  });
  if (!resGet.body || !resGet.body.success) {
    throw new Error("\nError en sembrado GET compras:\n" + JSON.stringify(resGet.body, null, 2));
  }

  const resPut = await request(app).post('/api/compras').set('Cookie', cookie).send({
    compra: { id_proveedor: proveedorId, id_sucursal: sucursalId, id_empleado: empleadoId },
    detalles: [{ id_producto: productoId, cantidad: 2, costo_unitario: 100 }],
  });
  if (!resPut.body || !resPut.body.success) {
    throw new Error("\nError en sembrado PUT compras:\n" + JSON.stringify(resPut.body, null, 2));
  }
  compraPutId = resPut.body.data.id;

  const resCancel = await request(app).post('/api/compras').set('Cookie', cookie).send({
    compra: { id_proveedor: proveedorId, id_sucursal: sucursalId, id_empleado: empleadoId },
    detalles: [{ id_producto: productoId, cantidad: 3, costo_unitario: 150 }],
  });
  if (!resCancel.body || !resCancel.body.success) {
    throw new Error("\nError en sembrado CANCELAR compras:\n" + JSON.stringify(resCancel.body, null, 2));
  }
  compraCancelId = resCancel.body.data.id;
});

describe('POST /api/compras', () => {
  it('crea compra completa con número de orden automático', async () => {
    const res = await request(app)
      .post('/api/compras')
      .set('Cookie', cookie)
      .send({
        compra: {
          id_proveedor: proveedorId,
          id_sucursal: sucursalId,
          id_empleado: empleadoId
        },
        detalles: [
          {
            id_producto: productoId,
            cantidad: 10,
            costo_unitario: 200,
          },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('numero_orden');
    expect(res.body.data.numero_orden).toMatch(/^OC-/);
    expect(res.body.data.total_compra).toBe(2000);
    expect(res.body.data.detalles).toHaveLength(1);
    expect(res.body.data.estado_entrega).toBe('PENDIENTE');
  });

  it('crea compra con número de orden manual', async () => {
    const numeroOrden = `MANUAL-${Date.now()}`;
    const res = await request(app)
      .post('/api/compras')
      .set('Cookie', cookie)
      .send({
        compra: {
          numero_orden: numeroOrden,
          id_proveedor: proveedorId,
          id_sucursal: sucursalId,
          id_empleado: empleadoId
        },
        detalles: [
          { id_producto: productoId, cantidad: 1, costo_unitario: 100 },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.data.numero_orden).toBe(numeroOrden);
  });

  it('rechaza compra sin detalles', async () => {
    const res = await request(app)
      .post('/api/compras')
      .set('Cookie', cookie)
      .send({
        compra: { id_proveedor: proveedorId, id_sucursal: sucursalId, id_empleado: empleadoId },
        detalles: [],
      });

    expect(res.status).toBe(400);
  });

  it('rechaza proveedor inválido (UUID inválido)', async () => {
    const res = await request(app)
      .post('/api/compras')
      .set('Cookie', cookie)
      .send({
        compra: { id_proveedor: 'xxx', id_sucursal: sucursalId, id_empleado: empleadoId },
        detalles: [{ id_producto: productoId, cantidad: 1, costo_unitario: 1 }],
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('ID de proveedor inválido');
  });
});

describe('GET /api/compras', () => {
  it('lista compras paginadas con proveedor', async () => {
    const res = await request(app).get('/api/compras').set('Cookie', cookie);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0]).toHaveProperty('proveedor');
  });

  it('filtra por estado_entrega', async () => {
    const res = await request(app).get('/api/compras?estado_entrega=PENDIENTE').set('Cookie', cookie);
    expect(res.body.data.every(c => c.estado_entrega === 'PENDIENTE')).toBe(true);
  });

  it('filtra por proveedor', async () => {
    const res = await request(app)
      .get(`/api/compras?id_proveedor=${proveedorId}`)
      .set('Cookie', cookie);

    expect(res.body.data.every(c => c.id_proveedor === proveedorId)).toBe(true);
  });
});

describe('GET /api/compras/:id', () => {
  it('encuentra compra con detalles', async () => {
    const res = await request(app).get(`/api/compras/${compraPutId}`).set('Cookie', cookie);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('detalles');
    expect(res.body.data.detalles.length).toBeGreaterThanOrEqual(1);
  });
});

describe('PUT /api/compras/:id', () => {
  it('actualiza estado de entrega', async () => {
    const res = await request(app)
      .put(`/api/compras/${compraPutId}`)
      .set('Cookie', cookie)
      .send({ estado_entrega: 'RECIBIDO' });

    expect(res.status).toBe(200);
    expect(res.body.data.estado_entrega).toBe('RECIBIDO');
  });
});

describe('PUT /api/compras/:id/cancelar', () => {
  it('cancela compra', async () => {
    const res = await request(app)
      .put(`/api/compras/${compraCancelId}/cancelar`)
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.data.estado_entrega).toBe('CANCELADO');
  });

  it('rechaza cancelar dos veces', async () => {
    const res = await request(app)
      .put(`/api/compras/${compraCancelId}/cancelar`)
      .set('Cookie', cookie);

    expect(res.status).toBe(400);
  });
});