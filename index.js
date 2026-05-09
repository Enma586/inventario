import { createServer } from 'http';
import app from './app.js';
import { connectDB } from './src/config/db.js';
import { sequelize } from './src/models/index.js';
import { initSocket } from './src/config/socket.js';
import { env } from './src/config/env.js';

const server = createServer(app);

initSocket(server);

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION:', err);
    server.close(() => process.exit(1));
});

const startServer = async () => {
    try {
        await connectDB();
        await sequelize.sync({ alter: true });
        console.log('Todos los modelos fueron sincronizados exitosamente.');
        server.listen(env.PORT, () => {
            console.log(`Servidor corriendo en el puerto ${env.PORT}`);
        });
    } catch (error) {
        console.error('Error fatal al iniciar el sistema:', error);
        process.exit(1);
    }
};

startServer();