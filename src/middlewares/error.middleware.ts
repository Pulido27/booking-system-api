import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
import logger from '../config/logger.js';
import { success, ZodError } from 'zod';
import { Prisma } from '../generated/prisma/client.js'

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction,
) => {

    // Zod validation error handling
    if (err instanceof ZodError) {
        logger.error({
            err: {
                message: 'Validation error',
                errors: err.issues,
            },
            req: {
                method: req.method,
                url: req.url,
                ip: req.ip,
            },
        }, 'Validation failed');

        res.status(400).json({
            success: false,
            message: 'Error de validacion',
            errors: err.issues.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
            })),
        });
        return;
    }

    // Prisma error handling

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        logger.error({
            err: {
                message: err.message,
                code: err.code,
                meta: err.meta,
            },
            req: {
                method: req.method,
                url: req.originalUrl,
                ip: req.ip,
            },
        }, 'Database error');

        if (err.code === 'P2002') {
            res.status(409).json({
                success: false,
                message: 'El recurso ya existe'
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: 'Error de base de datos',
        });
        return;
    }

    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err instanceof AppError ? err.message : 'Internal Server Error';

    logger.error({
        err: {
            message: err.message,
            stack: err.stack,
            statusCode
        },
        req: {
            method: req.method,
            url: req.originalUrl,
            ip: req.ip
        }
    }, 'Request failed');


    res.status(statusCode).json({
        success: false,
        message
    });
};