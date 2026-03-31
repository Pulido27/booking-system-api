import { Router } from 'express';
import { serviceController } from './service.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';


const router = Router();

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Obtener todos los servicios
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Lista de servicios
 */
router.get('/', serviceController.findAll);

/**
 * @swagger
 * /services/{id}:
 *   get:
 *     summary: Obtener un servicio por ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Servicio encontrado
 *       404:
 *         description: Servicio no encontrado
 */
router.get('/:id', serviceController.findById);

/**
 * @swagger
 * /services:
 *   post:
 *     summary: Crear un nuevo servicio
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - duration
 *             properties:
 *               name:
 *                 type: string
 *                 example: Corte de cabello
 *               description:
 *                 type: string
 *                 example: Corte profesional
 *               price:
 *                 type: number
 *                 example: 200
 *               duration:
 *                 type: number
 *                 example: 30
 *     responses:
 *       201:
 *         description: Servicio creado
 *       401:
 *         description: No autorizado
 */
router.post('/', authenticate, requireRole(['ADMIN', 'PROVIDER']), serviceController.create);

/**
 * @swagger
 * /services/{id}:
 *   put:
 *     summary: Actualizar un servicio
 *     tags: [Services]
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
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               duration:
 *                 type: number
 *     responses:
 *       200:
 *         description: Servicio actualizado
 */
router.put('/:id', authenticate, requireRole(['ADMIN', 'PROVIDER']), serviceController.update);

/**
 * @swagger
 * /services/{id}:
 *   delete:
 *     summary: Eliminar un servicio
 *     tags: [Services]
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
 *         description: Servicio eliminado
 */
router.delete('/:id', authenticate, requireRole(['ADMIN']), serviceController.delete);

export default router;