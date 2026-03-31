import { z } from 'zod';

export const createTimeSlotSchema = z.object({
    startTime: z
        .iso.datetime({ message: "Formato de fecha inválido. Usar ISO 8601" })
        .transform((val) => new Date(val)),
    endTime: z
        .iso.datetime({ message: 'Formato de fecha inválido. Usar ISO 8601' })
        .transform((val) => new Date(val)),
}).refine(
    (data) => data.endTime > data.startTime, 
    {
        message: 'endTime debe ser posterior a starTime',
        path: ['endTime'],
    }
)

export type CreateTimeSlotInput = z.infer<typeof createTimeSlotSchema>;