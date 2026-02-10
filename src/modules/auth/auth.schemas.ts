import { z } from 'zod';

export const registerSchema = z.object({
    email: z 
        .string()
        .email('El email no es valido')
        .toLowerCase() 
        .trim(),
    password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(100, 'La contraseña es demasiado larga'),
    name: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre es demasiado largo')
        .trim(),
    role: z
        .enum(['ADMIN', 'PROVIDER', 'CLIENT'])
        .optional()
        .default('CLIENT'),
});

export const loginSchema = z.object({
    email : z
        .string()
        .email()
        .toLowerCase()
        .trim(),
    password: z
        .string()
        .min(1, 'La contraseña es requerida'),
});

export type RegisterInput = z.infer<typeof registerSchema>

export type LoginInput = z.infer<typeof loginSchema>