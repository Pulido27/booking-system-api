import { prisma } from '../../lib/prisma.js';
import { NotFoundError } from '../../utils/NotFoundError.js';
import { UnauthorizedError } from '../../utils/UnauthorizedError.js';

import type {
    CreateAppointmentInput,
    UpdateAppointmentStatusInput,
} from './appointment.schemas.js'

export class AppointmentService {

    async create(data: CreateAppointmentInput, clientId: string) {
        const timeSlot = await prisma.timeSlot.findUnique({
            where: { id: data.timeSlotId},
            include: {
                provider: true,
            },
        });

        if (!timeSlot) {
            throw new NotFoundError('TimeSlot no encontrado');
        }

        if (!timeSlot.isAvailable) {
        throw new UnauthorizedError('TimeSlot no está disponible');
        }

        const service = await prisma.service.findUnique({
            where: { id: data.serviceId},
        });

        if (!service) {
            throw new NotFoundError('Servicio no encontrado');
        }

        if (!service.isActive) {
            throw new UnauthorizedError('Servicio no está activo');
        }

        // Validar que el servicio si pertenece al provider del time Slot

        if (service.providerId !== timeSlot.providerId) {
            throw new UnauthorizedError('El servicio no pertenece al provider de este TimeSlot');
        }

        const appointmentTime = new Date(data.appointmentTime);
        const appointmentEnd = new Date(appointmentTime);
        appointmentEnd.setMinutes(appointmentEnd.getMinutes() + service.duration);
        
        //Comprobar si la cita cabe en el timeslot

        if (appointmentTime < timeSlot.startTime) {
            throw new UnauthorizedError(
                `La cita empieza antes del horario disponible (${timeSlot.startTime.toISOString()})`
            );
        }

        if (appointmentEnd > timeSlot.endTime) {
            throw new UnauthorizedError(
                `El servicio terminaría fuera del horario disponible (necesita hasta ${appointmentEnd.toISOString()}, disponible hasta ${timeSlot.endTime.toISOString()})`
            );
        }

        // validar que no haya agendado una cita antes de la fecha actual 
        if (appointmentTime < new Date()) {
            throw new UnauthorizedError('No se pueden crear citas en el pasado');
        }

        // Validacion para evitar traslapes entre el provider

        const existingAppointments = await prisma.appointment.findMany({
            where: {
                timeSlot: {
                    providerId: timeSlot.providerId,
                },
                status: {in: ['PENDING', 'CONFIRMED']},
            },
            include: {
                service: true,
            },
        });

        for (const existing of existingAppointments) {
            
            const existingEnd = new Date(existing.appointmentTime);

            existingEnd.setMinutes(
                existingEnd.getMinutes() + existing.service.duration
            );

            const overlaps = !(
                appointmentEnd <= existing.appointmentTime || 
                appointmentTime >= existingEnd
            );

            if (overlaps) {
                throw new UnauthorizedError(
                    `Ya existe una cita confirmada en ese horario (${existing.appointmentTime.toISOString()} - ${existingEnd.toISOString()})`
                );
            }
        }

        const appointment = await prisma.appointment.create({
            data: {
                appointmentTime,
                clientId,
                serviceId: data.serviceId,
                timeSlotId: data.timeSlotId,
                notes: data.notes,
                status: 'PENDING',
            },
            include: {
                service: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        duration: true,
                    },
                },
                timeSlot: {
                    include: {
                        provider: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                client: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return appointment;
    }

    async findAll(userId: string, userRole: string) {

        if (userRole === 'ADMIN') {
            return await prisma.appointment.findMany({
                include: {
                    service: true,
                    client: {
                        select: { id: true, name: true, email: true },
                    },
                    timeSlot: {
                        include: {
                            provider: {
                                select: { id: true, name: true },
                            },
                        },
                    },
                },
                orderBy: {
                    appointmentTime: 'desc',
                },
            });
        }

        if (userRole === 'PROVIDER') {
            return await prisma.appointment.findMany({
                where: {
                    timeSlot: {
                        providerId: userId,
                    },
                },
                include: {
                    service: true,
                    client: {
                        select: { id: true, name: true, email: true },
                    },
                    timeSlot: true,
                },
                orderBy: {
                    appointmentTime: 'desc',
                },
            });
        }

        // para el rol del cliente
        return await prisma.appointment.findMany({
            where: {
                clientId: userId,
            },
            include: {
                service: true,
                timeSlot: {
                    include: {
                        provider: {
                        select: { id: true, name: true },
                        },
                    },
                },
            },
            orderBy: {
                appointmentTime: 'desc',
            },
        });
    }

    async findById(id: string, userId: string, userRole: string) {
        const appointment = await prisma.appointment.findUnique({
            where: { id },
            include: {
                service: true,
                client: {
                    select: { id: true, name: true, email: true },
                },
                timeSlot: {
                    include: {
                        provider: {
                            select: { id: true, name: true, email: true },
                        },
                    },
                },
            },
        });

        if (!appointment) {
            throw new NotFoundError('Cita no encontrada');
        }

        // Verificar permisos
        if (userRole !== 'ADMIN') {
            const isClient = appointment.clientId === userId;
            const isProvider = appointment.timeSlot.providerId === userId;

            if (!isClient && !isProvider) {
                throw new UnauthorizedError('No tienes permiso para ver esta cita');
            }
        }

        return appointment;
  }
    
    async updateStatus(
        id: string,
        data: UpdateAppointmentStatusInput,
        userId: string,
        userRole: string
    ) {
        
        const appointment = await prisma.appointment.findUnique({
            where: { id },
            include: {
                timeSlot: true,
            },
        });

        if (!appointment) {
            throw new NotFoundError('Cita no encontrada');
        }

        const isClient = appointment.clientId === userId;
        const isProvider = appointment.timeSlot.providerId === userId;
        const isAdmin = userRole === 'ADMIN';

        //  Solo el provider o el admin pueden confirmar o completar
        if (
            (data.status === 'CONFIRMED' || data.status === 'COMPLETED') && 
            !isProvider && 
            !isAdmin
        ) {
            throw new UnauthorizedError(
                'Solo el provider o admin pueden confirmar/completar citas'
            );
        }

        // Si no es el cliente o el dueño del servicio o admin no puede actualizar nada 
        // basicamente es una forma de corroborar que le que hizo la peticion si esta involucraod en esta relacion de cita
        if (data.status === 'CANCELLED' && !isClient && !isProvider && !isAdmin) {
            throw new UnauthorizedError('No tienes permiso para cancelar esta cita');
        }


        const updatedAppointment = await prisma.appointment.update({
            where: { id },
            data: { status: data.status },
            include: {
                service: true,
                client: {
                    select: { id: true, name: true, email: true },
                },
                timeSlot: {
                    include: {
                        provider: {
                            select: { id: true, name: true },
                        },
                    },
                },
            },
        });

        return updatedAppointment;
    }

     async cancel(id: string, userId: string, userRole: string) {
        return await this.updateStatus(
            id, { status: 'CANCELLED' }, userId, userRole
        );
    }
}

export const appointmentService = new AppointmentService();