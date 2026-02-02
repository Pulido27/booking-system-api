import { AppError } from "./AppError.js";

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized - Invalid credentials') {
        super(message, 401);
    }
}