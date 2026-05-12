import { Router } from "express";
import { proveedorController } from "../../controllers/index.js";
import { auth, validate, roleGuard, auditLog } from "../../middlewares/index.js";
import {
  paramsIdSchema,
  createProveedorSchema,
  updateProveedorSchema,
  queryProveedorSchema,
} from "../../schemas/index.js";

const router = Router();

router.get(
  "/",
  auth,
  validate(queryProveedorSchema, "query"),
  proveedorController.findAll,
);
router.get(
  "/:id",
  auth,
  validate(paramsIdSchema, "params"),
  proveedorController.findById,
);
router.post(
  "/",
  auth,
  roleGuard("ADMIN", "EMPLEADO"),

  validate(createProveedorSchema, "body"),
  auditLog('Proveedor'),
  proveedorController.create,
);
router.put(
  "/:id",
  auth,
    roleGuard("ADMIN"),
  validate(paramsIdSchema, "params"),
  validate(updateProveedorSchema, "body"),
  auditLog('Proveedor'),
  proveedorController.update,
);
router.delete(
  "/:id",
  auth,
    roleGuard("ADMIN"),
  validate(paramsIdSchema, "params"),
  auditLog('Proveedor'),
  proveedorController.remove,
);

export default router;
