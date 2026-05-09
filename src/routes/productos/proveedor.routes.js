import { Router } from "express";
import { proveedorController } from "../../controllers/index.js";
import { auth, validate, roleGuard } from "../../middlewares/index.js";
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
  proveedorController.create,
);
router.put(
  "/:id",
  auth,
    roleGuard("ADMIN"),
  validate(paramsIdSchema, "params"),
  validate(updateProveedorSchema, "body"),
  proveedorController.update,
);
router.delete(
  "/:id",
  auth,
    roleGuard("ADMIN"),
  validate(paramsIdSchema, "params"),
  proveedorController.remove,
);

export default router;
