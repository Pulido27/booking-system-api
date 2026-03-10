import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { UnauthorizedError } from "../utils/UnauthorizedError.js";
import { catchAsync } from "../utils/catchAsync.js";

// Extend Request from typescript to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
                role: string;
            };
        }
    }
}

export const authenticate = catchAsync( 
    async (req: Request, res: Response, next: NextFunction) => {
        // Extract the token
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('Token no proporcionado')
        }

        const token = authHeader.split(' ')[1]; // Bearer Token 

        const payload = verifyToken(token);

        if (!payload) {
            throw new UnauthorizedError('Token invalido o expirado');
        }

        // Add user to req
        req.user = payload;
        
        next();
    }
);