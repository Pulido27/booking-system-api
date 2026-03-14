import { Router } from 'express';
import { serviceController } from './service.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import de from 'zod/v4/locales/de.js';

const router = Router();


router.get('/', serviceController.findAll);
router.get('/:id', serviceController.findById);

router.post('/', authenticate, requireRole(['ADMIN', 'PROVIDER']), serviceController.create);

router.put('/:id', authenticate, requireRole(['ADMIN', 'PROVIDER']), serviceController.update);

router.delete('/:id', authenticate, requireRole(['ADMIN']), serviceController.delete);

export default router;