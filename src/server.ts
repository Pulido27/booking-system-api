import app  from './app.js';
import { env } from './config/env.js';
import logger from './config/logger.js';
import { prisma } from './lib/prisma.js';
import type { Server } from 'http';

const PORT = env.PORT || 3000;
let server: Server;

// Start the server
startServer();


//Test the database connection
async function startServer() {
    try {
        await prisma.$queryRaw`SELECT 1`;
        logger.info('Database connected');

        server = app.listen(PORT, () => {
            logger.info(`Server running on http://localhost:${PORT}`);
            logger.info(`Environment: ${env.NODE_ENV}`)
        })
        
    } catch (error) {
        logger.error({err: error}, 'Failed BD connection');
        process.exit(1);
    }
}


//////////ERRORS


// Asycn errors
process.on('unhandledRejection', (reason: Error) => {

    logger.error({ err: reason}, 'unhandled Rejection');
    gracefulShutdown();
});
/*
//Sync errors
process.on('uncaughtException', (reason: Error) => {

    logger.error({ err: reason}, 'uncaugh Exception');
    gracefulShutdonw();

})
*/
/*
// In case we use kubernets
process.on('SIGTERM', () => {
    logger.info('SIGTERM recived, shutting down gracefuly...');
    gracefulShutdown();
})
*/

process.on('SIGINT', async() => {
    logger.info('SIGINT recived, shutting down gracefully...');
    gracefulShutdown();
});

function gracefulShutdown() {
    server.close(async() => {
        logger.info('HTTP server close');
        
        try {
            await prisma.$disconnect();
            logger.info('Database connection closed');
            process.exit(0);
        } catch(error) {
            logger.info({err: error}, 'Error during shutdown');
            process.exit(1);
        }
    })
}