import { beforeAll, afterAll, beforeEach } from 'vitest';
import sequelize from '../config/db.js';

beforeAll(async () => {
  // Sincroniza todas las tablas en la BD de test
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

// Helper: login y obtener cookie para tests autenticados
export const loginAs = async (request, email = 'admin@test.com', password = '123456') => {
  const res = await request.post('/api/auth/login').send({ email, password });
  return res.headers['set-cookie'];
};