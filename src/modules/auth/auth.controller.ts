import type { Request, Response } from "express";
import { authService } from './auth.service.js';
import { registerSchema, loginSchema } from './auth.schemas.js';
import { catchAsync } from "../../utils/catchAsync.js";

class AuthController {

    register = catchAsync(async (req: Request, res: Response) => {

        // Validate req with zod
        const validatedData = registerSchema.parse(req.body);

        // Call service
        const result = await authService.register(validatedData);

        //Response
        res.status(201).json({
            status: 'success',
            data: result,
        });
    });

    login = catchAsync(async (req: Request, res:Response) => {

        // Validate body
        const validatedData = loginSchema.parse(req.body);

        // call service
        const result = await authService.login(validatedData);

        //Response
        res.status(200).json({
            status: 'success',
            data: result,
        });
    });
}

export const authController = new AuthController();