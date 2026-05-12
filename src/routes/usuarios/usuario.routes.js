import { Router } from "express";
import { usuarioController } from "../../controllers/index.js";
import { auth, roleGuard, validate, auditLog } from "../../middlewares/index.js";
import {
  paramsIdSchema,
  createUsuarioSchema,
  updateUsuarioSchema,
  queryUsuarioSchema,
} from "../../schemas/index.js";

const router = Router();

router.get(
  "/",
  auth,
  validate(queryUsuarioSchema, "query"),
  usuarioController.findAll,
);
router.get(
  "/:id",
  auth,
  validate(paramsIdSchema, "params"),
  usuarioController.findById,
);
router.post(
  "/",
  auth,
  roleGuard("ADMIN", "EMPLEADO"),
  validate(createUsuarioSchema, "body"),
  auditLog('Usuario'),
  usuarioController.create,
);
router.put(
  "/:id",
  auth,
  roleGuard("ADMIN"),
  validate(paramsIdSchema, "params"),
  validate(updateUsuarioSchema, "body"),
  auditLog('Usuario'),
  usuarioController.update,
);
router.delete(
  "/:id",
  auth,
  roleGuard("ADMIN"),
  validate(paramsIdSchema, "params"),
  auditLog('Usuario'),
  usuarioController.remove,
);

export default router;
