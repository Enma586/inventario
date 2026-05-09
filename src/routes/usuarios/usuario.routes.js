import { Router } from 'express';
import { usuarioController } from '../../controllers/index.js';
import { auth, roleGuard, validate } from '../../middlewares/index.js';
import {
  paramsIdSchema,
  createUsuarioSchema,
  updateUsuarioSchema,
  queryUsuarioSchema,
} from '../../schemas/index.js';

const router = Router();

router.use(auth);

router.get('/',    validate(queryUsuarioSchema, 'query'),    usuarioController.findAll);
router.post('/',   roleGuard('ADMIN'), validate(createUsuarioSchema, 'body'), usuarioController.create);
router.get('/:id', validate(paramsIdSchema, 'params'),       usuarioController.getById);
router.put('/:id', roleGuard('ADMIN'), validate(updateUsuarioSchema, 'body'), usuarioController.update);
router.delete('/:id', roleGuard('ADMIN'), validate(paramsIdSchema, 'params'), usuarioController.remove);

export default router;