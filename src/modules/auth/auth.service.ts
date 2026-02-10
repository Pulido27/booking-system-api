import { prisma } from '../../lib/prisma.js';
import { hashPassword, comparePassword } from '../../utils/password.js';
import { generateToken } from '../../utils/jwt.js';
import { UnauthorizedError } from '../../utils/UnauthorizedError.js';
import type { RegisterInput, LoginInput } from './auth.schemas.js';

export class AuthService {

    async register (data: RegisterInput) {

        //Verify if the user exist already
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new UnauthorizedError('El email ya esta registrado')
        }

        // Hash password
        const passwordHash = await hashPassword(data.password);

        // Create user in the bd
        const user = await prisma.user.create({
            data: {
                email: data.email,
                passwordHash,
                name: data.name,
                role: data.role || 'CLIENT'
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });

        //Generate token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role
        });


        return {
            user,
            token,
        };

    }

    async login (data: LoginInput) {

        //Search the user by email
        const user = await prisma.user.findUnique({
            where: { email : data.email },
        });
        
        if (!user) {
            throw new UnauthorizedError('Credenciales invalidas');
        }

        // Validate password

        const isValidPassword = comparePassword(data.password,user.passwordHash);

        if (!isValidPassword) {
            throw new UnauthorizedError('Credenciales invalidas');
        } 

        // Generate token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        })

        //  Destructuring and exlcude the password
        const { passwordHash, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            token,
        };
    }
}

export const authService = new AuthService();