import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware.js';
import { notFoundHandler } from './middlewares/notFound.middleware.js';
import logger from './config/logger.js';

const app: Application = express();

//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

logger.info('Initializin Booking System Api');

app.get('/', (req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'Booking System API',
        version: '1.0.0',
        timeStamp: new Date().toISOString()
    });
});

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
