import prisma from '../models/index.js';

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('Conexión exitosa a la base de datos');
  } catch (error) {
    console.error('Error fatal al conectar a la base de datos:', error);
    process.exit(1);
  }
};