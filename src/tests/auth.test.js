import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import app from '../../app.js'; // Asegúrate de que esta ruta apunte correctamente a tu app.js

// Interceptamos socket.js para evitar que lance error al no estar inicializado en los tests
vi.mock('../config/socket.js', () => ({
  getIO: () => ({ emit: vi.fn() }),
  initSocket: vi.fn()
}));

describe('POST /api/auth/register', () => {
  it('crea usuario + empleado y devuelve cookie con token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        usuario: {
          nombre_usuario: 'admin',
          email: 'admin@test.com',
          password: '123456',
          rol: 'ADMIN',
        },
        empleado: {
          nombres: 'Carlos',
          apellidos: 'Hernández',
          dui: '12345678-9',
        },
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.usuario).toHaveProperty('id');
    expect(res.body.data.usuario).not.toHaveProperty('password');
    expect(res.body.data.empleado).toHaveProperty('nombres');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('rechaza email duplicado', async () => {
    await request(app).post('/api/auth/register').send({
      usuario: { nombre_usuario: 'admin2', email: 'dup@test.com', password: '123456' },
      empleado: { nombres: 'A', apellidos: 'B', dui: '11111111-1' },
    });

    const res = await request(app).post('/api/auth/register').send({
      usuario: { nombre_usuario: 'admin3', email: 'dup@test.com', password: '123456' },
      empleado: { nombres: 'C', apellidos: 'D', dui: '22222222-2' },
    });

    expect(res.status).toBe(409);
  });

  it('rechaza body inválido — falta email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      usuario: { nombre_usuario: 'x', password: '123' },
      empleado: { nombres: 'A', apellidos: 'B', dui: '33333333-3' }, 
    });

    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send({
      usuario: { nombre_usuario: 'login_test', email: 'login@test.com', password: '123456' },
      empleado: { nombres: 'Test', apellidos: 'User', dui: '44444444-4' }, 
    });
  });

  it('loguea y setea cookie httpOnly', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test.com', password: '123456' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.usuario).not.toHaveProperty('password');
    expect(res.headers['set-cookie'][0]).toContain('HttpOnly');
  });

  it('recuerda sesión con rememberMe=true', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test.com', password: '123456', rememberMe: true });

    expect(res.status).toBe(200);
  });

  it('rechaza credenciales incorrectas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test.com', password: 'wrong' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /api/auth/me', () => {
  it('devuelve datos del usuario autenticado', async () => {
    await request(app).post('/api/auth/register').send({
      usuario: { nombre_usuario: 'me_test', email: 'me@test.com', password: '123456' },
      empleado: { nombres: 'Me', apellidos: 'Test', dui: '55555555-5' },
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'me@test.com', password: '123456' });

    const cookie = loginRes.headers['set-cookie'];

    const res = await request(app).get('/api/auth/me').set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('me@test.com');
    expect(res.body.data).not.toHaveProperty('password');
  });

  it('rechaza sin cookie', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/renew', () => {
  it('renueva el token y devuelve nueva cookie', async () => {
    await request(app).post('/api/auth/register').send({
      usuario: { nombre_usuario: 'renew_t', email: 'renew@test.com', password: '123456' },
      empleado: { nombres: 'R', apellidos: 'T', dui: '66666666-6' },
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'renew@test.com', password: '123456' });

    const res = await request(app)
      .get('/api/auth/renew')
      .set('Cookie', loginRes.headers['set-cookie']);

    expect(res.status).toBe(200);
    expect(res.body.data.usuario.email).toBe('renew@test.com');
    expect(res.headers['set-cookie']).toBeDefined();
  });
});

describe('POST /api/auth/logout', () => {
  it('limpia la cookie', async () => {
    await request(app).post('/api/auth/register').send({
      usuario: { nombre_usuario: 'out_t', email: 'out@test.com', password: '123456' },
      empleado: { nombres: 'O', apellidos: 'T', dui: '77777777-7' },
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'out@test.com', password: '123456' });

    const res = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', loginRes.headers['set-cookie']);

    expect(res.status).toBe(200);
    expect(res.body.message).toContain('cerrada');
  });
});