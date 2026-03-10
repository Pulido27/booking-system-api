import { prisma } from '../../lib/prisma.js';
import { NotFoundError } from '../../utils/NotFoundError.js';
import { UnauthorizedError } from '../../utils/UnauthorizedError.js';
import type { CreateServiceInput, UpdateServiceInput } from './service.schemas.js';

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
            }
        })
    }

}
