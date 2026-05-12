import { Router } from "express";
import { sucursalController } from "../../controllers/index.js";
import { auth, roleGuard, validate, auditLog } from "../../middlewares/index.js";
import {
  paramsIdSchema,
  createSucursalSchema,
  updateSucursalSchema,
  querySucursalSchema,
} from "../../schemas/index.js";

const router = Router();

router.get(
  "/",
  auth,
  validate(querySucursalSchema, "query"),
  sucursalController.findAll,
);
router.get(
  "/:id",
  auth,
  validate(paramsIdSchema, "params"),
  sucursalController.findById,
);
router.post(
  "/",
  auth,
  roleGuard("ADMIN"),
  validate(createSucursalSchema, "body"),
  auditLog('Sucursal'),
  sucursalController.create,
);
router.put(
  "/:id",
  auth,
  roleGuard("ADMIN"),
  validate(paramsIdSchema, "params"),
  validate(updateSucursalSchema, "body"),
  auditLog('Sucursal'),
  sucursalController.update,
);
router.delete(
  "/:id",
  auth,
  roleGuard("ADMIN"),
  validate(paramsIdSchema, "params"),
  auditLog('Sucursal'),
  sucursalController.remove,
);

export default router;
