import { Router } from 'express';
import { appointmentController } from './appointment.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';

const router = Router();

// Con esto me evito escribir autenticate en todas las rutas
router.use(authenticate);


router.post(
  '/',
  requireRole(['CLIENT']),
  appointmentController.create
);

router.get('/', appointmentController.findAll);
router.get('/:id', appointmentController.findById);
router.patch('/:id', appointmentController.updateStatus);
router.delete('/:id', appointmentController.cancel);

export default router;