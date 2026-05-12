import { Router } from "express";
import { empleadoController } from "../../controllers/index.js";
import { auth, validate, roleGuard, auditLog } from "../../middlewares/index.js";
import {
  paramsIdSchema,
  createEmpleadoSchema,
  updateEmpleadoSchema,
  queryEmpleadoSchema,
} from "../../schemas/index.js";

const router = Router();

router.get(
  "/",
  auth,
  validate(queryEmpleadoSchema, "query"),
  empleadoController.findAll,
);
router.get(
  "/:id",
  auth,
  validate(paramsIdSchema, "params"),
  empleadoController.findById,
);
router.post(
  "/",
  auth,
  roleGuard("ADMIN"),
  validate(createEmpleadoSchema, "body"),
  auditLog('Empleado'),
  empleadoController.create,
);
router.put(
  "/:id",
  auth,
  roleGuard("ADMIN"),
  validate(paramsIdSchema, "params"),
  validate(updateEmpleadoSchema, "body"),
  auditLog('Empleado'),
  empleadoController.update,
);
router.delete(
  "/:id",
  auth,
  roleGuard("ADMIN"),
  validate(paramsIdSchema, "params"),
  auditLog('Empleado'),
  empleadoController.remove,
);

export default router;
