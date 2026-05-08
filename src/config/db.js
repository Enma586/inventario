import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Inicializamos Sequelize usando la URL de tu .env
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Cambia a 'console.log' si quieres ver el SQL crudo en la terminal
  pool: {
    max: 10,      
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});


export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a PostgreSQL establecida.');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    process.exit(1);
  }
};

export default sequelize;