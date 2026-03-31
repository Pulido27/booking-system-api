import { Router } from 'express';
import { timeSlotController } from './timeslot.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';

const router = Router();

/**
 * @swagger
 * /timeslots:
 *   get:
 *     summary: Obtener todos los time slots disponibles
 *     tags: [TimeSlots]
 *     responses:
 *       200:
 *         description: Lista de time slots
 */
router.get('/', timeSlotController.findAll);

/**
 * @swagger
 * /timeslots/provider/{providerId}:
 *   get:
 *     summary: Obtener time slots de un provider
 *     tags: [TimeSlots]
 *     parameters:
 *       - in: path
 *         name: providerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de time slots del provider
 */
router.get('/provider/:providerId', timeSlotController.findByProvider);

/**
 * @swagger
 * /timeslots/{id}:
 *   get:
 *     summary: Obtener un time slot por ID
 *     tags: [TimeSlots]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Time slot encontrado
 *       404:
 *         description: No encontrado
 */
router.get('/:id', timeSlotController.findById);

/**
 * @swagger
 * /timeslots:
 *   post:
 *     summary: Crear disponibilidad (time slot)
 *     tags: [TimeSlots]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startTime
 *               - endTime
 *             properties:
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2030-01-01T10:00:00Z
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2030-01-01T18:00:00Z
 *              
 *     responses:
 *       201:
 *         description: Time slot creado
 *       401:
 *         description: No autorizado
 */
router.post(
  '/',
  authenticate,
  requireRole(['ADMIN', 'PROVIDER']),
  timeSlotController.create
);

/**
 * @swagger
 * /timeslots/{id}:
 *   delete:
 *     summary: Eliminar un time slot
 *     tags: [TimeSlots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Time slot eliminado
 *       401:
 *         description: No autorizado
 */
router.delete(
  '/:id',
  authenticate,
  requireRole(['ADMIN', 'PROVIDER']),
  timeSlotController.delete
);

export default router;