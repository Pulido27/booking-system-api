import { Router } from 'express';
import { timeSlotController } from './timeslot.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';

const router = Router();

router.get('/', timeSlotController.findAll);
router.get('/provider/:providerId', timeSlotController.findByProvider);
router.get('/:id', timeSlotController.findById);

router.post(
  '/',
  authenticate,
  requireRole(['ADMIN', 'PROVIDER']),
  timeSlotController.create
);

router.delete(
  '/:id',
  authenticate,
  requireRole(['ADMIN', 'PROVIDER']),
  timeSlotController.delete
);

export default router;