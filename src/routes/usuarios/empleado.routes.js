import { Router } from 'express';
import { empleadoController } from '../../controllers/index.js';
import { auth, validate } from '../../middlewares/index.js';
import {
  paramsIdSchema,
  createEmpleadoSchema,
  updateEmpleadoSchema,
  queryEmpleadoSchema,
} from '../../schemas/index.js';

const router = Router();

router.use(auth);

router.get('/',    validate(queryEmpleadoSchema, 'query'),    empleadoController.list);
router.post('/',   validate(createEmpleadoSchema, 'body'),    empleadoController.create);
router.get('/:id', validate(paramsIdSchema, 'params'),        empleadoController.getById);
router.put('/:id', validate(updateEmpleadoSchema, 'body'),    empleadoController.update);
router.delete('/:id', validate(paramsIdSchema, 'params'),     empleadoController.remove);

export default router;