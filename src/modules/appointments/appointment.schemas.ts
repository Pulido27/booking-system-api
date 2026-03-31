import { z } from 'zod';

export const createAppointmentSchema = z.object({
    serviceId: z
        .uuid('El ID del servicio deve ser un UUID valido'),
    timeSlotId: z
        .uuid('El ID del TimeSlot debe ser un UUID válido'),
    appointmentTime: z
        .iso.datetime({message: 'Formato de fecha inválido. Usar ISO 8601'})
        .transform((val) => new Date(val)),
    notes: z
        .string()
        .max(500, 'Las notas son demasiado largas')
        .trim()
        .optional(),
});

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(
    ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
    {
      message: 'Status inválido',
    }
  ),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentStatusInput = z.infer<typeof updateAppointmentStatusSchema>;

