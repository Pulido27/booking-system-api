import { time } from 'node:console';
import { prisma } from '../../lib/prisma.js'
import { NotFoundError } from '../../utils/NotFoundError.js'
import { UnauthorizedError } from '../../utils/UnauthorizedError.js'
import type { CreateTimeSlotInput } from './timeslot.schemas.js';

export class TimeSlotService {

    async create(data: CreateTimeSlotInput, providerId: string) {

        const conflictingSlot = await prisma.timeSlot.findFirst({
            where: {
                providerId,
                startTime: { lt: data.endTime },
                endTime: { gt: data.startTime },
            },
        });

        if (conflictingSlot) {
            throw new UnauthorizedError('Ya existe un TimeSlot que se traslapa con este horario');
        }

        const timeSlot = await prisma.timeSlot.create({
            data: {
                ...data,
                providerId,
            },
            include: {
                provider: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return timeSlot;
    }


    async findByProvider(providerId: string) {
        const timeSlots = await prisma.timeSlot.findMany({
            where: {
                providerId,
                isAvailable: true,
                endTime: { gte: new Date() },
            },
            orderBy: {
                startTime: 'asc',
            },
            include: {
                provider: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return timeSlots;
    }

    async findAll() {
        const timeSlots = await prisma.timeSlot.findMany({
            where: {
                isAvailable: true,
                endTime: { gte: new Date() },
            },
            orderBy: {
                startTime: 'asc',
            },
            include: {
                provider: {
                    select: {
                        id : true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return timeSlots;
    }

    async findById(id: string) {
        const timeSlot = await prisma.timeSlot.findUnique({
            where: { id },
            include: {
                provider: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },

                appointments : {
                    select: {
                        id: true,
                        appointmentTime: true,
                        status: true,
                        client: {
                            select: {
                                name: true,
                                email:true,
                            },
                        },
                    },
                },
            },
        });

        if (!timeSlot) {
            throw new NotFoundError('TimeSlot no encontrado');
        }
        
        return timeSlot;
    }

    async delete(id: string, userId: string, userRole: string) {
        const timeSlot = await prisma.timeSlot.findUnique({
          where: { id },
          include: {
            appointments: true,
          },
        });

        if (!timeSlot) {
            throw new NotFoundError('TimeSlot no encontrado');
        }

        if (timeSlot.providerId !== userId && userRole !== 'ADMIN') {
            throw new UnauthorizedError('No tienes permiso para eliminar este TimeSlot');
        }

        const hasActiveAppointments = timeSlot.appointments.some(
            (apt) => apt.status === 'CONFIRMED' || apt.status === 'PENDING'
        );

        if (hasActiveAppointments) {
            throw new UnauthorizedError(
                'No se puede eliminar un TimeSlot con citas confirmadas o pendientes'
            );
        }

        await prisma.timeSlot.delete({
            where: {id},
        });

        return { message: 'TimeSlot eliminado exitosamente'};
    }
}

export const timeSlotService = new TimeSlotService();