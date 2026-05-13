import { Router } from 'express';
import { bitacoraController } from '../../controllers/index.js';
import { auth, roleGuard, validate } from '../../middlewares/index.js';
import { queryBitacoraSchema } from '../../schemas/index.js';

const router = Router();

router.get('/', auth, roleGuard('ADMIN'), validate(queryBitacoraSchema, 'query'), bitacoraController.getBitacora);
export default router;