import { describe, it, expect, beforeAll, vi } from 'vitest';
import request from 'supertest';
import app from './app.js';
import { loginAs } from './setup.js';

// 1. MOCK DE SOCKET.IO (Obligatorio para que no colapse el servidor al crear/editar)
vi.mock('../config/socket.js', () => ({
  getIO: () => ({ emit: vi.fn() }),
  initSocket: vi.fn()
}));

let cookie, categoriaId, productoPutId, productoDeleteId;

const generateDui = () => `${Math.floor(10000000 + Math.random() * 90000000)}-${Math.floor(Math.random() * 10)}`;

beforeAll(async () => {
  const unique = Date.now();
  const email = `prod_${unique}@test.com`;

  // 2. Registro seguro y único
  const reg = await request(app).post('/api/auth/register').send({
    usuario: { nombre_usuario: `prod_${unique}`, email: email, password: 'Password123!', rol: 'ADMIN' },
    empleado: { nombres: 'Prod', apellidos: 'Test', dui: generateDui() },
  });

  if (!reg.body || !reg.body.success) {
    throw new Error("\n🚨 EL BACKEND RECHAZÓ EL REGISTRO:\n" + JSON.stringify(reg.body, null, 2) + "\n");
  }

  cookie = await loginAs(request(app), email, 'Password123!');

  // 3. Crear categoría única para amarrar los productos
  const cat = await request(app)
    .post('/api/categorias')
    .set('Cookie', cookie)
    .send({ nombre: `General ${unique}` });
  categoriaId = cat.body.data.id;

  // 4. Sembrado de productos para los tests de GET
  await request(app).post('/api/productos').set('Cookie', cookie).send({
    sku: `F1-${unique}`, nombre: 'Mouse', id_categoria: categoriaId, costo_compra: 500, precio_venta: 1500,
  });
  await request(app).post('/api/productos').set('Cookie', cookie).send({
    sku: `F2-${unique}`, nombre: 'Teclado', id_categoria: categoriaId, costo_compra: 1000, precio_venta: 3000,
  });

  // 5. Productos específicos para testear PUT y DELETE sin que choquen
  const resPut = await request(app).post('/api/productos').set('Cookie', cookie).send({
    sku: `PUT-${unique}`, nombre: 'Monitor', id_categoria: categoriaId, costo_compra: 10000, precio_venta: 15000,
  });
  productoPutId = resPut.body.data.id;

  const resDel = await request(app).post('/api/productos').set('Cookie', cookie).send({
    sku: `DEL-${unique}`, nombre: 'Cable', id_categoria: categoriaId, costo_compra: 100, precio_venta: 200,
  });
  productoDeleteId = resDel.body.data.id;
});

describe('POST /api/productos', () => {
  it('crea producto con precios en centavos', async () => {
    const res = await request(app)
      .post('/api/productos')
      .set('Cookie', cookie)
      .send({
        sku: `SKU-${Date.now()}`, // SKU dinámico
        nombre: 'Laptop',
        id_categoria: categoriaId,
        costo_compra: 80000,
        precio_venta: 120000,
      });

    expect(res.status).toBe(201);
    expect(res.body.data.precio_venta).toBe(120000);
    expect(res.body.data.costo_compra).toBe(80000);
    expect(res.body.data.estado).toBe('DISPONIBLE');
  });

  it('rechaza SKU duplicado', async () => {
    const skuDuplicado = `DUP-${Date.now()}`;
    
    // Lo creamos la primera vez
    await request(app).post('/api/productos').set('Cookie', cookie).send({
      sku: skuDuplicado, nombre: 'A', id_categoria: categoriaId, costo_compra: 100, precio_venta: 200,
    });
    
    // Intentamos meter el mismo SKU
    const res = await request(app).post('/api/productos').set('Cookie', cookie).send({
      sku: skuDuplicado, nombre: 'B', id_categoria: categoriaId, costo_compra: 100, precio_venta: 200,
    });
    
    expect(res.status).toBeGreaterThanOrEqual(400); // 400 de Zod o 409 de BD
  });

  it('rechaza precio negativo', async () => {
    const res = await request(app).post('/api/productos').set('Cookie', cookie).send({
      sku: `NEG-${Date.now()}`, nombre: 'X', id_categoria: categoriaId, precio_venta: -1, costo_compra: 0,
    });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/productos', () => {
  it('lista paginados con categoría', async () => {
    const res = await request(app).get('/api/productos').set('Cookie', cookie);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    expect(res.body.data[0]).toHaveProperty('categoria');
  });

  it('filtra por rango de precios', async () => {
    const res = await request(app)
      .get('/api/productos?precioMin=2000&precioMax=5000')
      .set('Cookie', cookie);

    expect(res.body.data.every(p => p.precio_venta >= 2000 && p.precio_venta <= 5000)).toBe(true);
  });

  it('filtra por estado', async () => {
    const res = await request(app)
      .get('/api/productos?estado=DISPONIBLE')
      .set('Cookie', cookie);

    expect(res.body.data.every(p => p.estado === 'DISPONIBLE')).toBe(true);
  });
});

describe('PUT /api/productos/:id', () => {
  it('doble validación — actualiza precio', async () => {
    const res = await request(app)
      .put(`/api/productos/${productoPutId}`)
      .set('Cookie', cookie)
      .send({ precio_venta: 99999 });

    expect(res.status).toBe(200);
    expect(res.body.data.precio_venta).toBe(99999);
  });
});

describe('DELETE /api/productos/:id', () => {
  it('elimina producto', async () => {
    const res = await request(app).delete(`/api/productos/${productoDeleteId}`).set('Cookie', cookie);
    expect(res.status).toBe(200);
    
    // Comprobamos que de verdad voló
    const verify = await request(app).get(`/api/productos/${productoDeleteId}`).set('Cookie', cookie);
    expect(verify.status).toBe(404);
  });
});