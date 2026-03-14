import { prisma } from '../../lib/prisma.js';
import { NotFoundError } from '../../utils/NotFoundError.js';
import { UnauthorizedError } from '../../utils/UnauthorizedError.js';
import { updateServiceSchema, type CreateServiceInput, type UpdateServiceInput } from './service.schemas.js';

export class ServiceService {
    // Create service (only ADMIN o PROVIDER)
    async create(data: CreateServiceInput, providerId: string) {
        const service = await prisma.service.create({
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

        return service;
    }

    async findAll() {
        const services = await prisma.service.findMany({
            where: {
                isActive: true,
            },
            include: {
                provider: {
                    select: {
                        id: true,
                        name: true,
                        email:true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return services;
    }

    async findById(id: string) {
        const service = await prisma.service.findUnique({
            where: { id },
            include: {
                provider: {
                    select: {
                        id : true,
                        name : true,
                        email: true,
                    },
                },
            },
        });

        if (!service) {
            throw new NotFoundError('Servicio no encontrado');
        }

        return service;
    }

    async update(id: string, data: UpdateServiceInput, userId: string, userRole: string) {
        const service = await prisma.service.findUnique({
            where: {id},
        });

        if(!service) {
            throw new NotFoundError('Servicio no encontrado');
        }

        if (service.providerId !== userId && userRole !== 'ADMIN') {
            throw new UnauthorizedError('No tienes permiso para modificar este servicio')
        }

        const updateService = await prisma.service.update({
            where: {id},
            data,
            include : {
                provider: {
                    select: {
                        id : true,
                        name : true,
                        email: true,
                    },
                },
            },
        });

        return updateService;
    }

    async delete(id : string) {
        const service = await prisma.service.findUnique({
            where: {id},
        });

        if (!service) {
            throw new NotFoundError("Servicio no encontrado");
        }

        await prisma.service.update({
            where: {id},
            data: {
                isActive : false,
            }
        });

        return { message: 'Servicio eliminado exitosamente'};
    }
}

export const serviceService = new ServiceService();