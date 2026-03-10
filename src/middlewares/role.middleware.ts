import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../utils/UnauthorizedError.js";

export const requireRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Verify User authenticate
        if (!req.user) {
            throw new UnauthorizedError('No autenticado');
        }

        //Verity the rol
        if (!allowedRoles.includes(req.user.role)) {
            throw new UnauthorizedError(
                'No tienes permisos para acceder a este recurso'
            );
        }

        next();
    };
};