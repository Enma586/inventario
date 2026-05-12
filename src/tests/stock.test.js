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

let cookie, sucursalId, categoriaId;
let prodUpsertId, prodGetId, prodBajoId, prodPutId, prodDelId;

const generateDui = () => `${Math.floor(10000000 + Math.random() * 90000000)}-${Math.floor(Math.random() * 10)}`;

beforeAll(async () => {
  const unique = Date.now();
  const email = `stk_${unique}@test.com`;

  const reg = await request(app).post('/api/auth/register').send({
    usuario: { nombre_usuario: `stk_${unique}`, email: email, password: 'Password123!', rol: 'ADMIN' },
    empleado: { nombres: 'Stk', apellidos: 'Test', dui: generateDui() },
  });

  if (!reg.body || !reg.body.success) {
    throw new Error("\nError en el registro:\n" + JSON.stringify(reg.body, null, 2) + "\n");
  }

  cookie = await loginAs(request(app), email, 'Password123!');

  const [depto] = await Departamento.findOrCreate({ where: { nombre: 'Sonsonate' } });
  const [muni] = await Municipio.findOrCreate({ where: { nombre: 'Sonsonate Centro' }, defaults: { id_departamento: depto.id } });
  const [dist] = await Distrito.findOrCreate({ where: { nombre: 'Sonsonate Centro' }, defaults: { id_municipio: muni.id } });

  const s = await request(app).post('/api/sucursales').set('Cookie', cookie).send({ 
    nombre: `Bodega ${unique}`, direccion: 'Av. Siempre Viva', id_distrito: dist.id 
  });
  sucursalId = s.body.data.id;

  const c = await request(app).post('/api/categorias').set('Cookie', cookie).send({ nombre: `StockCat ${unique}` });
  categoriaId = c.body.data.id;

  const crearProducto = async (prefijo) => {
    const p = await request(app).post('/api/productos').set('Cookie', cookie).send({
      sku: `${prefijo}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      nombre: `Producto ${prefijo}`,
      id_categoria: categoriaId,
      costo_compra: 50,
      precio_venta: 100,
    });
    return p.body.data.id;
  };

  prodUpsertId = await crearProducto('UPS');
  prodGetId = await crearProducto('GET');
  prodBajoId = await crearProducto('LOW');
  prodPutId = await crearProducto('PUT');
  prodDelId = await crearProducto('DEL');

  await request(app).post('/api/stocks').set('Cookie', cookie).send({ id_producto: prodGetId, id_sucursal: sucursalId, cantidad: 100 });
  await request(app).post('/api/stocks').set('Cookie', cookie).send({ id_producto: prodBajoId, id_sucursal: sucursalId, cantidad: 2 });
  await request(app).post('/api/stocks').set('Cookie', cookie).send({ id_producto: prodPutId, id_sucursal: sucursalId, cantidad: 30 });
  await request(app).post('/api/stocks').set('Cookie', cookie).send({ id_producto: prodDelId, id_sucursal: sucursalId, cantidad: 50 });
});

describe('POST /api/stocks', () => {
  it('crea stock (upsert)', async () => {
    const res = await request(app)
      .post('/api/stocks')
      .set('Cookie', cookie)
      .send({ id_producto: prodUpsertId, id_sucursal: sucursalId, cantidad: 50 });

    expect(res.status).toBe(200);
    const cantidad = res.body.data.stock ? res.body.data.stock.cantidad : res.body.data.cantidad;
    expect(cantidad).toBe(50);
  });

  it('upsert — actualiza cantidad si ya existe', async () => {
    await request(app).post('/api/stocks').set('Cookie', cookie).send({
      id_producto: prodUpsertId, id_sucursal: sucursalId, cantidad: 10,
    });

    const res = await request(app).post('/api/stocks').set('Cookie', cookie).send({
      id_producto: prodUpsertId, id_sucursal: sucursalId, cantidad: 75,
    });

    expect(res.status).toBe(200);
    const cantidad = res.body.data.stock ? res.body.data.stock.cantidad : res.body.data.cantidad;
    expect(cantidad).toBe(75);
  });

  it('rechaza ID de producto inválido', async () => {
    const res = await request(app).post('/api/stocks').set('Cookie', cookie).send({
      id_producto: 'no-uuid', id_sucursal: sucursalId, cantidad: 1,
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('ID de producto inválido');
  });
});

describe('GET /api/stocks', () => {
  it('lista stocks paginados con producto y sucursal', async () => {
    const res = await request(app).get('/api/stocks').set('Cookie', cookie);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0]).toHaveProperty('producto');
    expect(res.body.data[0]).toHaveProperty('sucursal');
  });

  it('filtra por id_sucursal', async () => {
    const res = await request(app)
      .get(`/api/stocks?id_sucursal=${sucursalId}`)
      .set('Cookie', cookie);

    expect(res.body.data.every(s => s.id_sucursal === sucursalId)).toBe(true);
  });
});

describe('GET /api/stocks/bajo', () => {
  it('lista productos con stock bajo', async () => {
    const res = await request(app).get('/api/stocks/bajo?limite=5').set('Cookie', cookie);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });
});

describe('PUT /api/stocks/:id_producto/:id_sucursal', () => {
  it('actualiza cantidad con doble validación', async () => {
    const res = await request(app)
      .put(`/api/stocks/${prodPutId}/${sucursalId}`)
      .set('Cookie', cookie)
      .send({ cantidad: 500 });

    expect(res.status).toBe(200);
    const cantidad = res.body.data.stock ? res.body.data.stock.cantidad : res.body.data.cantidad;
    expect(cantidad).toBe(500);
  });

  it('rechaza cantidad negativa', async () => {
    const res = await request(app)
      .put(`/api/stocks/${prodPutId}/${sucursalId}`)
      .set('Cookie', cookie)
      .send({ cantidad: -1 });

    expect(res.status).toBe(400);
  });

  it('rechaza params inválidos', async () => {
    const res = await request(app)
      .put('/api/stocks/xxx/yyy')
      .set('Cookie', cookie)
      .send({ cantidad: 10 });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('ID de producto inválido');
  });
});

describe('DELETE /api/stocks/:id_producto/:id_sucursal', () => {
  it('elimina stock', async () => {
    const res = await request(app)
      .delete(`/api/stocks/${prodDelId}/${sucursalId}`)
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    
    const verify = await request(app)
      .get(`/api/stocks?id_producto=${prodDelId}`)
      .set('Cookie', cookie);
    expect(verify.body.data.length).toBe(0);
  });
});