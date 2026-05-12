import { beforeAll, afterAll } from 'vitest';
import sequelize from '../config/db.js';

beforeAll(async () => {
  // Eliminar todos los ENUMs existentes en el schema public
  await sequelize.query(`
    DO $$ DECLARE r RECORD;
    BEGIN
      FOR r IN (
        SELECT t.typname
        FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE n.nspname = 'public' AND t.typtype = 'e'
      ) LOOP
        EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.typname) || ' CASCADE';
      END LOOP;
    END $$;
  `);

  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

export const loginAs = async (request, email = 'admin@test.com', password = '123456') => {
  const res = await request.post('/api/auth/login').send({ email, password });
  return res.headers['set-cookie'];
};