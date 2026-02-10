import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware.js';
import { notFoundHandler } from './middlewares/notFound.middleware.js';
import logger from './config/logger.js';
import authRoutes from './modules/auth/auth.routes.js';

const app: Application = express();

//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

logger.info('Initializin Booking System Api');

//Healtchecker
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Booking System API v1',
        timeStamp: new Date().toISOString()
    });
});

//Routes
app.use('/api/v1/auth', authRoutes);


//Errors middlewares
app.use(notFoundHandler);

app.use(errorHandler);

export default app;
