import { beforeAll, afterAll } from 'vitest';
import sequelize from '../config/db.js';

beforeAll(async () => {
  // Nuclear: regenera el schema public desde cero — no quedan ENUMs huérfanos
  await sequelize.query(`DROP SCHEMA public CASCADE`);
  await sequelize.query(`CREATE SCHEMA public`);
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

export const loginAs = async (request, email = 'admin@test.com', password = '123456') => {
  const res = await request.post('/api/auth/login').send({ email, password });
  return res.headers['set-cookie'];
};