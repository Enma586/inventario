import { describe, it, expect, beforeAll, vi } from 'vitest';
import request from 'supertest';
import app from './app.js';
import { loginAs } from './setup.js';

// 1. MOCK DE SOCKET.IO (Obligatorio para evitar caídas en eventos)
vi.mock('../config/socket.js', () => ({
  getIO: () => ({ emit: vi.fn() }),
  initSocket: vi.fn()
}));

let adminCookie, usuarioId;

// Helper para generar DUIs aleatorios válidos y evitar colisiones (Ej. 12345678-9)
const generateDui = () => `${Math.floor(10000000 + Math.random() * 90000000)}-${Math.floor(Math.random() * 10)}`;

beforeAll(async () => {
  // Generamos credenciales únicas
  const unique = Date.now();
  const email = `admin_emp_${unique}@test.com`;
  const password = 'Password123!';

  const reg = await request(app).post('/api/auth/register').send({
    usuario: { nombre_usuario: `admin_emp_${unique}`, email: email, password: password, rol: 'ADMIN' },
    empleado: { nombres: 'Admin', apellidos: 'Root', dui: generateDui() },
  });

  // Detector de mentiras por si Zod o la BD rechazan el registro inicial
  if (!reg.body || !reg.body.success) {
    throw new Error("\nEL BACKEND RECHAZÓ EL REGISTRO INICIAL:\n" + JSON.stringify(reg.body, null, 2) + "\n");
  }

  adminCookie = await loginAs(request(app), email, password);
  usuarioId = reg.body.data.usuario.id;
});

describe('GET /api/empleados', () => {
  it('lista empleados paginados', async () => {
    const res = await request(app).get('/api/empleados').set('Cookie', adminCookie);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.pagination).toHaveProperty('total');
    expect(res.body.data[0]).toHaveProperty('nombres');
    expect(res.body.data[0]).toHaveProperty('apellidos');
    expect(res.body.data[0]).toHaveProperty('usuario');
  });

  it('filtra por búsqueda', async () => {
    const res = await request(app).get('/api/empleados?search=Root').set('Cookie', adminCookie);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it('rechaza sin autenticación', async () => {
    const res = await request(app).get('/api/empleados');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/empleados/:id', () => {
  it('encuentra por ID', async () => {
    const list = await request(app).get('/api/empleados').set('Cookie', adminCookie);
    const id = list.body.data[0].id;

    const res = await request(app).get(`/api/empleados/${id}`).set('Cookie', adminCookie);
    expect(res.status).toBe(200);
    // Verificamos que traiga los datos del usuario relacionado
    expect(res.body.data.usuario).toBeDefined();
  });

  it('rechaza ID inválido', async () => {
    const res = await request(app).get('/api/empleados/no-uuid').set('Cookie', adminCookie);
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('UUID');
  });
});

describe('POST /api/empleados', () => {
  it('crea empleado asociado a un usuario existente', async () => {
    const res = await request(app)
      .post('/api/empleados')
      .set('Cookie', adminCookie)
      .send({
        id_usuario: usuarioId, 
        nombres: 'Otro',
        apellidos: 'Empleado',
        dui: generateDui(), // DUI dinámico
      });

    if (res.status !== 201) {
      console.error('\nERROR AL CREAR EMPLEADO:', JSON.stringify(res.body, null, 2), '\n');
    }

    expect(res.status).toBe(201);
    expect(res.body.data.nombres).toBe('Otro');
  });

  it('rechaza dui duplicado', async () => {
    const sharedDui = generateDui(); // Creamos un DUI y lo forzamos en ambos

    await request(app).post('/api/empleados').set('Cookie', adminCookie).send({
      id_usuario: usuarioId, nombres: 'X', apellidos: 'Y', dui: sharedDui,
    });

    const res = await request(app).post('/api/empleados').set('Cookie', adminCookie).send({
      id_usuario: usuarioId, nombres: 'Z', apellidos: 'W', dui: sharedDui,
    });

    // Zod, Sequelize o tu lógica de negocio deberían rebotar esto
    expect(res.status).toBeGreaterThanOrEqual(400); 
  });
});

describe('PUT /api/empleados/:id', () => {
  it('actualiza con doble validación', async () => {
    const list = await request(app).get('/api/empleados').set('Cookie', adminCookie);
    const id = list.body.data[0].id;

    const res = await request(app)
      .put(`/api/empleados/${id}`)
      .set('Cookie', adminCookie)
      .send({ nombres: 'Actualizado' });

    expect(res.status).toBe(200);
    expect(res.body.data.nombres).toBe('Actualizado');
  });

  it('rechaza body inválido — nombres vacíos', async () => {
    const list = await request(app).get('/api/empleados').set('Cookie', adminCookie);
    const id = list.body.data[0].id;

    const res = await request(app)
      .put(`/api/empleados/${id}`)
      .set('Cookie', adminCookie)
      .send({ nombres: '' });

    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/empleados/:id', () => {
  it('elimina empleado', async () => {
    const list = await request(app).get('/api/empleados').set('Cookie', adminCookie);
    const id = list.body.data[0].id;

    const res = await request(app).delete(`/api/empleados/${id}`).set('Cookie', adminCookie);
    expect(res.status).toBe(200);

    const verify = await request(app).get(`/api/empleados/${id}`).set('Cookie', adminCookie);
    expect(verify.status).toBe(404);
  });
});