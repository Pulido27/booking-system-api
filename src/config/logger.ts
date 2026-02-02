import pino from 'pino';
import { env } from '../config/env.js'

const isDevelopment = env.NODE_ENV === 'development';

export const logger = pino({
    level: env.LOG_LEVEL || 'info',
    transport: isDevelopment
        ? {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'yyyy-mm-dd HH:MM:ss',
                ignore: 'pid,hostname'
            }
        }
        : undefined
});

export default logger;