import { PrismaClient } from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// 1. Creas el pool de conexiones usando tu variable del .env
const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL 
});

// 2. Creas el adaptador de PostgreSQL para Prisma
const adapter = new PrismaPg(pool);

// 3. Instancias el cliente inyectando el adaptador
const prisma = new PrismaClient({ adapter });

export default prisma;