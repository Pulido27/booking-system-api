import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
import logger from '../config/logger.js'

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
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
    }, 'Request failed')

    res.status(statusCode).json({
        success: false,
        message
    });
};