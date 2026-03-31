import type { Request, Response } from 'express';
import { appointmentService } from './appointment.service.js';
import {createAppointmentSchema, updateAppointmentStatusSchema,} from './appointment.schemas.js';
import { catchAsync } from '../../utils/catchAsync.js';

class AppointmentController {

    create = catchAsync(async (req: Request, res: Response) => {
        
        const validatedData = createAppointmentSchema.parse(req.body);

        const appointment = await appointmentService.create(validatedData,req.user!.userId);

        res.status(201).json({
            status: 'success',
            data: { appointment },
        });
    });

  
    findAll = catchAsync(async (req: Request, res: Response) => {
        const appointments = await appointmentService.findAll( req.user!.userId, req.user!.role);

        res.status(200).json({
            status: 'success',
            data: { appointments },
        });
    });


    findById = catchAsync(async (req: Request, res: Response) => {
        const appointment = await appointmentService.findById( req.params.id as string, req.user!.userId, req.user!.role);

        res.status(200).json({
            status: 'success',
            data: { appointment },
        });
    });

  
    updateStatus = catchAsync(async (req: Request, res: Response) => {
    
        const validatedData = updateAppointmentStatusSchema.parse(req.body);

        const appointment = await appointmentService.updateStatus(
            req.params.id as string,
            validatedData,
            req.user!.userId,
            req.user!.role
        );

        res.status(200).json({
            status: 'success',
            data: { appointment },
        });
    });

    cancel = catchAsync(async (req: Request, res: Response) => {
        const appointment = await appointmentService.cancel( req.params.id as string, req.user!.userId, req.user!.role);

        res.status(200).json({
            status: 'success',
            data: { appointment },
        });
    });
}

export const appointmentController = new AppointmentController();