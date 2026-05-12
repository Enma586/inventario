import { Router } from 'express';
import * as bitacoraController from '../../controllers/index.js';
import { auth, roleGuard } from '../../middlewares/index.js';

const router = Router();

router.get('/', auth, roleGuard('ADMIN'), bitacoraController.getBitacora);

export default router;