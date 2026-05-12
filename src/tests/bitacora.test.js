import { describe, it, expect, beforeAll, vi } from 'vitest';
import request from 'supertest';
import app from './app.js';
import { loginAs } from './setup.js';

vi.mock('../config/socket.js', () => ({
  getIO: () => ({ emit: vi.fn() }),
  initSocket: vi.fn()
}));

let adminCookie;
let empleadoCookie;
let unique;

beforeAll(async () => {
  unique = Date.now();
  const adminEmail = `bitadmin_${unique}@test.com`;

  const regAdmin = await request(app).post('/api/auth/register').send({
    usuario: { nombre_usuario: `bitadmin_${unique}`, email: adminEmail, password: 'Password123!', rol: 'ADMIN' },
    empleado: { nombres: 'BitAdmin', apellidos: 'Test', dui: `0000000${unique % 10}-${unique % 10}` },
  });

  if (!regAdmin.body || !regAdmin.body.success) {
    throw new Error("\nERROR EN BEFOREALL - REGISTRO ADMIN:\n" + JSON.stringify(regAdmin.body, null, 2));
  }

  adminCookie = await loginAs(request(app), adminEmail, 'Password123!');

  const empEmail = `bitemp_${unique}@test.com`;
  const regEmp = await request(app).post('/api/auth/register').send({
    usuario: { nombre_usuario: `bitemp_${unique}`, email: empEmail, password: 'Password123!', rol: 'EMPLEADO' },
    empleado: { nombres: 'BitEmp', apellidos: 'Test', dui: `0000000${(unique + 1) % 10}-${(unique + 1) % 10}` },
  });

  if (!regEmp.body || !regEmp.body.success) {
    throw new Error("\nERROR EN BEFOREALL - REGISTRO EMPLEADO:\n" + JSON.stringify(regEmp.body, null, 2));
  }

  empleadoCookie = await loginAs(request(app), empEmail, 'Password123!');

  // Sembramos datos para generar entradas en la bitácora
  await request(app).post('/api/categorias').set('Cookie', adminCookie).send({ nombre: `Cat Audit ${unique}` });
  await request(app).post('/api/proveedores').set('Cookie', adminCookie).send({ nombre: `Prov Audit ${unique}` });
});

describe('GET /api/bitacora', () => {
  it('rechaza sin autenticación', async () => {
    const res = await request(app).get('/api/bitacora');
    expect(res.status).toBe(401);
  });

  it('rechaza con rol EMPLEADO', async () => {
    const res = await request(app).get('/api/bitacora').set('Cookie', empleadoCookie);
    expect(res.status).toBe(403);
  });

  it('lista entradas paginadas', async () => {
    const res = await request(app).get('/api/bitacora').set('Cookie', adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.pagination).toHaveProperty('total');
    expect(res.body.pagination).toHaveProperty('currentPage');
    expect(res.body.pagination.total).toBeGreaterThanOrEqual(2);
  });

  it('incluye datos del usuario relacionado', async () => {
    const res = await request(app).get('/api/bitacora?page=1&limit=1').set('Cookie', adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.data[0]).toHaveProperty('usuario');
    if (res.body.data[0].usuario) {
      expect(res.body.data[0].usuario).toHaveProperty('nombre_usuario');
      expect(res.body.data[0].usuario).toHaveProperty('rol');
    }
  });

  it('incluye los campos de la entrada', async () => {
    const res = await request(app).get('/api/bitacora?page=1&limit=1').set('Cookie', adminCookie);

    expect(res.status).toBe(200);
    const entry = res.body.data[0];
    expect(entry).toHaveProperty('id');
    expect(entry).toHaveProperty('accion');
    expect(entry).toHaveProperty('entidad');
    expect(entry).toHaveProperty('createdAt');
    expect(entry.accion).toMatch(/^(CREATE|UPDATE|DELETE)$/);
  });

  it('filtra por accion', async () => {
    const res = await request(app).get('/api/bitacora?accion=CREATE').set('Cookie', adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.data.every(e => e.accion === 'CREATE')).toBe(true);
  });

  it('filtra por entidad', async () => {
    const res = await request(app).get('/api/bitacora?entidad=Categoria').set('Cookie', adminCookie);

    expect(res.status).toBe(200);
    const categorias = res.body.data.filter(e => e.entidad === 'Categoria');
    expect(categorias.length).toBeGreaterThanOrEqual(1);
  });

  it('paginación — page y limit', async () => {
    const res = await request(app).get('/api/bitacora?page=1&limit=2').set('Cookie', adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeLessThanOrEqual(2);
    expect(res.body.pagination.currentPage).toBe(1);
  });

  it('ordena por más reciente primero', async () => {
    const res = await request(app).get('/api/bitacora?page=1&limit=10').set('Cookie', adminCookie);

    if (res.body.data.length >= 2) {
      const a = new Date(res.body.data[0].createdAt);
      const b = new Date(res.body.data[1].createdAt);
      expect(a.getTime()).toBeGreaterThanOrEqual(b.getTime());
    }
  });
});
