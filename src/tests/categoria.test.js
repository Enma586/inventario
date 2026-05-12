import { describe, it, expect, beforeAll, vi } from 'vitest';
import request from 'supertest';
import app from './app.js';
import { loginAs } from './setup.js';

// 1. MOCK DE SOCKET.IO (Salvavidas del servidor)
vi.mock('../config/socket.js', () => ({
  getIO: () => ({ emit: vi.fn() }),
  initSocket: vi.fn()
}));

let cookie;
let categoriaTestId; // Guardaremos un ID específico para no depender de otros tests

const generateDui = () => `${Math.floor(10000000 + Math.random() * 90000000)}-${Math.floor(Math.random() * 10)}`;

beforeAll(async () => {
  const unique = Date.now();
  const email = `cat_${unique}@test.com`;

  // 2. Registro seguro con datos únicos
  const reg = await request(app).post('/api/auth/register').send({
    usuario: { nombre_usuario: `cat_${unique}`, email: email, password: 'Password123!', rol: 'ADMIN' },
    empleado: { nombres: 'Cat', apellidos: 'Test', dui: generateDui() },
  });

  if (!reg.body || !reg.body.success) {
    throw new Error("\n🚨 EL BACKEND RECHAZÓ EL REGISTRO EN CATEGORIAS:\n" + JSON.stringify(reg.body, null, 2) + "\n");
  }

  cookie = await loginAs(request(app), email, 'Password123!');

  // 3. Sembrado inicial (Seed) para que el GET, PUT y DELETE tengan datos con qué jugar
  await request(app).post('/api/categorias').set('Cookie', cookie).send({ nombre: `Ropa ${unique}` });
  await request(app).post('/api/categorias').set('Cookie', cookie).send({ nombre: `Calzado ${unique}` });
  
  // Guardamos una categoría específica para usarla en el test de actualización
  const catRes = await request(app)
    .post('/api/categorias')
    .set('Cookie', cookie)
    .send({ nombre: `CategoriaBase ${unique}` });
  
  categoriaTestId = catRes.body.data.id;
});

describe('POST /api/categorias', () => {
  it('crea categoría', async () => {
    const res = await request(app)
      .post('/api/categorias')
      .set('Cookie', cookie)
      .send({ nombre: `Electrónicos ${Date.now()}`, descripcion: 'Dispositivos y accesorios' });

    expect(res.status).toBe(201);
    expect(res.body.data.nombre).toContain('Electrónicos');
    expect(res.body.data).toHaveProperty('id');
  });

  it('rechaza nombre vacío', async () => {
    const res = await request(app)
      .post('/api/categorias')
      .set('Cookie', cookie)
      .send({ nombre: '' });

    expect(res.status).toBe(400);
  });

  it('rechaza nombre duplicado', async () => {
    const nombreDuplicado = `Única ${Date.now()}`;
    // Creamos la primera vez
    await request(app).post('/api/categorias').set('Cookie', cookie).send({ nombre: nombreDuplicado });
    // Intentamos crear exactamente la misma
    const res = await request(app).post('/api/categorias').set('Cookie', cookie).send({ nombre: nombreDuplicado });
    
    // Asumiendo que tu DB o Zod rechaza duplicados con un error 400 o 409
    expect(res.status).toBeGreaterThanOrEqual(400); 
  });
});

describe('GET /api/categorias', () => {
  it('lista categorías paginadas', async () => {
    const res = await request(app).get('/api/categorias').set('Cookie', cookie);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    expect(res.body.pagination.total).toBeGreaterThanOrEqual(2);
  });

  it('filtra por search', async () => {
    const res = await request(app).get('/api/categorias?search=Ropa').set('Cookie', cookie);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0].nombre).toContain('Ropa');
  });

  it('rechaza sin autenticación', async () => {
    const res = await request(app).get('/api/categorias');
    expect(res.status).toBe(401);
  });
});

describe('PUT /api/categorias/:id', () => {
  it('actualiza con doble validación', async () => {
    // Usamos el ID seguro que creamos en el beforeAll
    const res = await request(app)
      .put(`/api/categorias/${categoriaTestId}`)
      .set('Cookie', cookie)
      .send({ nombre: `Modificada ${Date.now()}` });

    expect(res.status).toBe(200);
    expect(res.body.data.nombre).toContain('Modificada');
  });

  it('rechaza ID inválido en params', async () => {
    const res = await request(app)
      .put('/api/categorias/xxxx')
      .set('Cookie', cookie)
      .send({ nombre: 'X' });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('UUID');
  });
});

describe('DELETE /api/categorias/:id', () => {
  it('elimina categoría', async () => {
    // Obtenemos la lista y borramos la primera para confirmar que el DELETE funciona
    const list = await request(app).get('/api/categorias').set('Cookie', cookie);
    const idParaEliminar = list.body.data[0].id;

    const res = await request(app).delete(`/api/categorias/${idParaEliminar}`).set('Cookie', cookie);
    expect(res.status).toBe(200);
  });
});