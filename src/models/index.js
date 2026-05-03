import pkg from '@prisma/client';
const { PrismaClient } = pkg;

import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Configuración del pool
const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL 
});

const adapter = new PrismaPg(pool);

// Instanciamos el cliente
const prisma = new PrismaClient({ adapter });

export default prisma;