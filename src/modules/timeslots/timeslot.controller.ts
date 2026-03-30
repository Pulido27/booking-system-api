import type { Request, Response } from 'express';
import { timeSlotService } from './timeslot.service.js';
import { createTimeSlotSchema } from './timeslot.schemas.js';
import { catchAsync } from '../../utils/catchAsync.js';

class TimeSlotController {

    create = catchAsync(async (req: Request, res: Response) => {

        const validatedData = createTimeSlotSchema.parse(req.body);

        const timeSlot = await timeSlotService.create(
            validatedData,
            req.user!.userId
        );

        res.status(201).json({
            status: 'success',
            data: { timeSlot },
        });
    });

    findAll = catchAsync(async (req: Request, res: Response) => {
        const timeSlots = await timeSlotService.findAll();

        res.status(200).json({
            status: 'success',
            data: { timeSlots },
        });
    });

    findByProvider = catchAsync(async (req: Request, res: Response) => {
        const timeSlots = await timeSlotService.findByProvider(
            req.params.providerId as string
        );

        res.status(200).json({
            status: 'success',
            data: { timeSlots },
        });
    });

    findById = catchAsync(async (req: Request, res: Response) => { 
        const timeSlot = await timeSlotService.findById(req.params.id as string);

        res.status(200).json({
            status: 'success',
            data: { timeSlot },
        });
    });

    delete = catchAsync(async (req: Request, res: Response) => {
        const result = await timeSlotService.delete(
            req.params.id as string,
            req.user!.userId,
            req.user!.role
        );

        res.status(200).json({
            status: 'success',
            data: result,
        });
    });
}

export const timeSlotController = new TimeSlotController();