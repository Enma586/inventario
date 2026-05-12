import { describe, it, expect, beforeAll, vi } from 'vitest';
import request from 'supertest';
import app from './app.js';
import { loginAs } from './setup.js';
import models from '../models/index.js'; // Necesitamos los modelos geográficos

const { Departamento, Municipio, Distrito } = models;

// 1. MOCK DE SOCKET.IO
vi.mock('../config/socket.js', () => ({
  getIO: () => ({ emit: vi.fn() }),
  initSocket: vi.fn()
}));

let cookie, distritoId, sucursalPutId, sucursalDeleteId;

const generateDui = () => `${Math.floor(10000000 + Math.random() * 90000000)}-${Math.floor(Math.random() * 10)}`;

beforeAll(async () => {
  const unique = Date.now();
  const email = `suc_${unique}@test.com`;

  // 2. Registro seguro
  const reg = await request(app).post('/api/auth/register').send({
    usuario: { nombre_usuario: `suc_${unique}`, email: email, password: 'Password123!', rol: 'ADMIN' },
    empleado: { nombres: 'Suc', apellidos: 'Test', dui: generateDui() },
  });

  if (!reg.body || !reg.body.success) {
    throw new Error("\n🚨 EL BACKEND RECHAZÓ EL REGISTRO:\n" + JSON.stringify(reg.body, null, 2) + "\n");
  }

  cookie = await loginAs(request(app), email, 'Password123!');

  // 3. Crear jerarquía geográfica (Obligatorio para la llave foránea de Sucursal)
  const [depto] = await Departamento.findOrCreate({ where: { nombre: 'Sonsonate' } });
  const [muni] = await Municipio.findOrCreate({ where: { nombre: 'Sonsonate Centro' }, defaults: { id_departamento: depto.id } });
  const [dist] = await Distrito.findOrCreate({ where: { nombre: 'Sonsonate Centro' }, defaults: { id_municipio: muni.id } });
  distritoId = dist.id;

  // 4. Sembrado inicial de sucursales para el GET
  await request(app).post('/api/sucursales').set('Cookie', cookie).send({ 
    nombre: `A ${unique}`, direccion: 'Dir A', id_distrito: distritoId 
  });
  await request(app).post('/api/sucursales').set('Cookie', cookie).send({ 
    nombre: `B ${unique}`, direccion: 'Dir B', activa: false, id_distrito: distritoId 
  });

  // 5. Sucursales aisladas para no cruzar los cables en PUT y DELETE
  const resPut = await request(app).post('/api/sucursales').set('Cookie', cookie).send({ 
    nombre: `Para PUT ${unique}`, direccion: 'Vieja Dir', id_distrito: distritoId 
  });
  sucursalPutId = resPut.body.data.id;

  const resDel = await request(app).post('/api/sucursales').set('Cookie', cookie).send({ 
    nombre: `Para DELETE ${unique}`, direccion: 'Dir Borrar', id_distrito: distritoId 
  });
  sucursalDeleteId = resDel.body.data.id;
});

describe('POST /api/sucursales', () => {
  it('crea sucursal activa por defecto', async () => {
    const res = await request(app)
      .post('/api/sucursales')
      .set('Cookie', cookie)
      .send({ 
        nombre: `Sucursal Centro ${Date.now()}`, 
        direccion: 'Calle Principal #1',
        id_distrito: distritoId // 🚨 Llave foránea obligatoria
      });

    expect(res.status).toBe(201);
    expect(res.body.data.activa).toBe(true);
  });

  it('crea sucursal inactiva', async () => {
    const res = await request(app)
      .post('/api/sucursales')
      .set('Cookie', cookie)
      .send({ 
        nombre: `Cerrada ${Date.now()}`, 
        direccion: 'Calle 2', 
        activa: false,
        id_distrito: distritoId 
      });

    expect(res.status).toBe(201);
    expect(res.body.data.activa).toBe(false);
  });

  it('rechaza nombre duplicado', async () => {
    const nombreUnico = `Única ${Date.now()}`;
    await request(app).post('/api/sucursales').set('Cookie', cookie).send({ 
      nombre: nombreUnico, direccion: 'Calle', id_distrito: distritoId 
    });
    
    const res = await request(app).post('/api/sucursales').set('Cookie', cookie).send({ 
      nombre: nombreUnico, direccion: 'Otra', id_distrito: distritoId 
    });
    
    expect(res.status).toBeGreaterThanOrEqual(400); // 409 de BD o 400 de validación
  });
});

describe('GET /api/sucursales', () => {
  it('lista paginadas', async () => {
    const res = await request(app).get('/api/sucursales').set('Cookie', cookie);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(2);
  });

  it('filtra por activa=true', async () => {
    const res = await request(app).get('/api/sucursales?activa=true').set('Cookie', cookie);
    expect(res.body.data.every(s => s.activa === true)).toBe(true);
  });

  it('filtra por activa=false', async () => {
    const res = await request(app).get('/api/sucursales?activa=false').set('Cookie', cookie);
    expect(res.body.data.every(s => s.activa === false)).toBe(true);
  });
});

describe('PUT /api/sucursales/:id', () => {
  it('doble validación — actualiza dirección', async () => {
    const res = await request(app)
      .put(`/api/sucursales/${sucursalPutId}`)
      .set('Cookie', cookie)
      .send({ direccion: 'Nueva Dirección' });

    expect(res.status).toBe(200);
    expect(res.body.data.direccion).toBe('Nueva Dirección');
  });
});

describe('DELETE /api/sucursales/:id', () => {
  it('elimina sucursal (solo ADMIN)', async () => {
    const res = await request(app).delete(`/api/sucursales/${sucursalDeleteId}`).set('Cookie', cookie);
    expect(res.status).toBe(200);

    // Confirmamos que ya no existe
    const verify = await request(app).get(`/api/sucursales/${sucursalDeleteId}`).set('Cookie', cookie);
    expect(verify.status).toBe(404);
  });
});