import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware.js';
import { notFoundHandler } from './middlewares/notFound.middleware.js';
import logger from './config/logger.js';

import authRoutes from './modules/auth/auth.routes.js';
import serviceRoutes from './modules/services/service.routes.js';
import timeSlotRoutes from './modules/timeslots/timeslot.routes.js';
import appointmentRoutes from './modules/appointments/appointment.routes.js';

const app: Application = express();

//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable('x-powered-by');

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

app.use('/api/v1/services', serviceRoutes);

app.use('/api/v1/timeslots', timeSlotRoutes);

app.use('/api/v1/appointments', appointmentRoutes);

// swagger
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Errors middlewares
app.use(notFoundHandler);

app.use(errorHandler);

export default app;
