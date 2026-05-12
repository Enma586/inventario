import { describe, it, expect, beforeAll, vi } from 'vitest';
import request from 'supertest';
import app from './app.js';
import { loginAs } from './setup.js';

// 1. MOCK DE SOCKET.IO (El chaleco antibalas del servidor)
vi.mock('../config/socket.js', () => ({
  getIO: () => ({ emit: vi.fn() }),
  initSocket: vi.fn()
}));

let cookie;
let proveedorPutId;
let proveedorDeleteId;

const generateDui = () => `${Math.floor(10000000 + Math.random() * 90000000)}-${Math.floor(Math.random() * 10)}`;

beforeAll(async () => {
  const unique = Date.now();
  const email = `prov_${unique}@test.com`;

  // 2. Registro seguro de una sola vez
  const reg = await request(app).post('/api/auth/register').send({
    usuario: { nombre_usuario: `prov_${unique}`, email: email, password: 'Password123!', rol: 'ADMIN' },
    empleado: { nombres: 'Prov', apellidos: 'Test', dui: generateDui() },
  });

  if (!reg.body || !reg.body.success) {
    throw new Error("\n🚨 EL BACKEND RECHAZÓ EL REGISTRO DEL PROVEEDOR:\n" + JSON.stringify(reg.body, null, 2) + "\n");
  }

  cookie = await loginAs(request(app), email, 'Password123!');

  // 3. Sembrado (Seeding) controlado de datos para los tests
  await request(app).post('/api/proveedores').set('Cookie', cookie).send({ nombre: `Proveedor A ${unique}` });
  await request(app).post('/api/proveedores').set('Cookie', cookie).send({ nombre: `Proveedor B ${unique}` });
  
  // Guardamos un proveedor específico para probar la actualización (PUT)
  const resPut = await request(app).post('/api/proveedores').set('Cookie', cookie).send({ nombre: `Para Actualizar ${unique}` });
  proveedorPutId = resPut.body.data.id;

  // Guardamos un proveedor específico para probar la eliminación (DELETE)
  const resDel = await request(app).post('/api/proveedores').set('Cookie', cookie).send({ nombre: `Para Borrar ${unique}` });
  proveedorDeleteId = resDel.body.data.id;
});

describe('POST /api/proveedores', () => {
  it('crea proveedor', async () => {
    const res = await request(app)
      .post('/api/proveedores')
      .set('Cookie', cookie)
      .send({ nombre: `Distribuidora S.A. ${Date.now()}`, contacto: '2233-4455' });

    expect(res.status).toBe(201);
    expect(res.body.data.nombre).toContain('Distribuidora S.A.');
  });

  it('rechaza nombre vacío', async () => {
    const res = await request(app)
      .post('/api/proveedores')
      .set('Cookie', cookie)
      .send({ nombre: '' });

    expect(res.status).toBe(400);
  });
});

describe('GET /api/proveedores', () => {
  it('lista paginados', async () => {
    const res = await request(app).get('/api/proveedores').set('Cookie', cookie);
    expect(res.status).toBe(200);
    // Ya creamos al menos 4 proveedores en el beforeAll, así que la lista debe traer data
    expect(res.body.data.length).toBeGreaterThanOrEqual(2);
  });

  it('filtra por search', async () => {
    const res = await request(app).get('/api/proveedores?search=Proveedor A').set('Cookie', cookie);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0].nombre).toContain('Proveedor A');
  });
});

describe('PUT /api/proveedores/:id', () => {
  it('doble validación — params + body', async () => {
    const res = await request(app)
      .put(`/api/proveedores/${proveedorPutId}`)
      .set('Cookie', cookie)
      .send({ contacto: 'nuevo@email.com' });

    expect(res.status).toBe(200);
    expect(res.body.data.contacto).toBe('nuevo@email.com');
  });
});

describe('DELETE /api/proveedores/:id', () => {
  it('elimina proveedor', async () => {
    const res = await request(app).delete(`/api/proveedores/${proveedorDeleteId}`).set('Cookie', cookie);
    expect(res.status).toBe(200);

    // Verificamos que realmente se borró
    const verify = await request(app).get(`/api/proveedores/${proveedorDeleteId}`).set('Cookie', cookie);
    expect(verify.status).toBe(404);
  });
});