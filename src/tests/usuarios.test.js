import { describe, it, expect, beforeAll, vi } from 'vitest';
import request from 'supertest';
import app from './app.js';
import { loginAs } from './setup.js';

// 1. MOCK DE SOCKET.IO (Obligatorio para que no explote el registro)
vi.mock('../config/socket.js', () => ({
  getIO: () => ({ emit: vi.fn() }),
  initSocket: vi.fn()
}));

let adminCookie;

beforeAll(async () => {
  // 2. Usamos el sufijo único para evitar errores de llave duplicada en PostgreSQL
  const unique = Date.now();
  const email = `admin_${unique}@test.com`;
  const password = 'Password123!';

  // 3. Registramos al usuario asegurando el DUI para Zod
  const resRegister = await request(app).post('/api/auth/register').send({
    usuario: { 
      nombre_usuario: `admin_${unique}`, 
      email: email, 
      password: password, 
      rol: 'ADMIN' 
    },
    empleado: { 
      nombres: 'Admin', 
      apellidos: 'Root', 
      dui: '00000000-0'    },
  });

  if (!resRegister.body.success) {
    throw new Error("\n\nERROR EN BEFOREALL - EL BACKEND RECHAZÓ EL REGISTRO: \n" + JSON.stringify(resRegister.body, null, 2) + "\n\n");
  }

  // 4. Atrapamos la cookie
  adminCookie = await loginAs(request(app), email, password);
});

describe('GET /api/usuarios', () => {
  it('lista usuarios paginados', async () => {
    const res = await request(app)
      .get('/api/usuarios?page=1&limit=5')
      .set('Cookie', adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.pagination).toHaveProperty('total');
    expect(res.body.pagination).toHaveProperty('currentPage');
  });

  it('filtra por rol', async () => {
    const res = await request(app)
      .get('/api/usuarios?rol=ADMIN')
      .set('Cookie', adminCookie);

    expect(res.body.data.every(u => u.rol === 'ADMIN')).toBe(true);
  });

  it('rechaza sin autenticación', async () => {
    const res = await request(app).get('/api/usuarios');
    expect(res.status).toBe(401);
  });
});

describe('PUT /api/usuarios/:id', () => {
  it('valida params y body por separado', async () => {
    // ID inválido → error de params (no llega a validar body)
    const res = await request(app)
      .put('/api/usuarios/no-es-uuid')
      .set('Cookie', adminCookie)
      .send({ nombre_usuario: 'x' });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('UUID');
  });

  it('actualiza usuario existente', async () => {
    // Obtenemos un usuario real de la base de datos (el que creamos arriba)
    const list = await request(app).get('/api/usuarios').set('Cookie', adminCookie);
    const userId = list.body.data[0].id;

    // Actualizamos su nombre de usuario (usamos unique para que no choque si hay otras reglas unique)
    const res = await request(app)
      .put(`/api/usuarios/${userId}`)
      .set('Cookie', adminCookie)
      .send({ nombre_usuario: `actualizado_${Date.now()}` });

    expect(res.status).toBe(200);
    expect(res.body.data.nombre_usuario).toContain('actualizado');
  });
});