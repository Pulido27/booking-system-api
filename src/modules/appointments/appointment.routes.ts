import { Router } from 'express';
import { appointmentController } from './appointment.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';

const router = Router();

// Con esto me evito escribir autenticate en todas las rutas
router.use(authenticate);

/**
 * @swagger
 * /api/v1/appointments:
 *   post:
 *     summary: Crear una cita
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serviceId
 *               - timeSlotId
 *               - appointmentTime
 *             properties:
 *               serviceId:
 *                 type: string
 *                 example: uuid-service
 *               timeSlotId:
 *                 type: string
 *                 example: uuid-timeslot
 *               appointmentTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-02-20T10:00:00Z
 *               notes:
 *                 type: string
 *                 example: Primera vez
 *     responses:
 *       201:
 *         description: Cita creada
 *       401:
 *         description: No autorizado
 */
router.post(
  '/',
  requireRole(['CLIENT']),
  appointmentController.create
);

/**
 * @swagger
 * /api/v1/appointments:
 *   get:
 *     summary: Obtener citas según el rol
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de citas
 */
router.get('/', appointmentController.findAll);

/**
 * @swagger
 * /api/v1/appointments/{id}:
 *   get:
 *     summary: Obtener una cita por ID
 *     tags: [Appointments]
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
 *         description: Cita encontrada
 *       404:
 *         description: No encontrada
 */
router.get('/:id', appointmentController.findById);

/**
 * @swagger
 * /api/v1/appointments/{id}:
 *   patch:
 *     summary: Actualizar estado de la cita
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: CONFIRMED
 *     responses:
 *       200:
 *         description: Estado actualizado
 */
router.patch('/:id', appointmentController.updateStatus);

/**
 * @swagger
 * /api/v1/appointments/{id}:
 *   delete:
 *     summary: Cancelar una cita
 *     tags: [Appointments]
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
 *         description: Cita cancelada
 */
router.delete('/:id', appointmentController.cancel);

export default router;

