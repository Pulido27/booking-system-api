import type { Request, Response } from "express";
import { serviceService } from "./service.service.js";
import { createServiceSchema, updateServiceSchema } from "./service.schemas.js";
import { catchAsync } from "../../utils/catchAsync.js";

class ServiceController {

    create = catchAsync(async (req: Request, res: Response) =>  {

        const validatedData = createServiceSchema.parse(req.body);

        const service = await serviceService.create(validatedData, req.user!.userId);

        res.status(201).json({
            status: 'success',
            data: { service },
        });
    })

    findAll = catchAsync(async (req: Request, res: Response) => {
        const services = await serviceService.findAll();

        res.status(200).json({
        status: 'success',
        data: { services },
        });
    });

    findById = catchAsync(async (req: Request, res: Response) => {
        const service = await serviceService.findById(req.params.id as string);

        res.status(200).json({
        status: 'success',
        data: { service },
        });
    });

    update = catchAsync(async (req: Request, res: Response) => {
        const validatedData = updateServiceSchema.parse(req.body);

        const service = await serviceService.update(
            req.params.id as string,
            validatedData,
            req.user!.userId,
            req.user!.role
        );

        res.status(200).json({
            status: 'success',
            data: { service },
        });
    })

    delete = catchAsync(async (req: Request, res: Response) => {
        const result = await serviceService.delete(req.params.id as string);

        res.status(200).json({
        status: 'success',
        data: result,
        });
    });
}

export const serviceController = new ServiceController();