import express from 'express';
import cookieParser from 'cookie-parser';
import { errorHandler } from '../middlewares/index.js';
import routes from '../routes/index.js';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api', routes);
app.use(errorHandler);

export default app;