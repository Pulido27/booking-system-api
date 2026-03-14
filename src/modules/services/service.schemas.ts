import { z } from 'zod';

export const createServiceSchema = z.object({
    name : z
        .string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(100, 'El nombre es demasiado largo')
        .trim(),
    description : z
        .string()
        .max(500, 'La descripcion es demasiado larga')
        .trim()
        .optional(),
    price: z
        .coerce
        .number()
        .positive('El precio debe ser mayor a 9')
        .max(1000000, 'El precio es demasiado alto'),
    duration: z
        .coerce
        .number()
        .int('La duración deber ser un número entero')
        .min(15, 'La duración mínima es 15 minutos')
        .max(480, 'La duración máxima es 8 horas'),
})

export const updateServiceSchema = createServiceSchema
    .partial()
    .extend({
        isActive: z.boolean().optional(),
    })

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;

