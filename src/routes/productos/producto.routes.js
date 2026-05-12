import { Router } from "express";
import { productoController } from "../../controllers/index.js";
import { auth, validate, roleGuard, auditLog } from "../../middlewares/index.js";
import {
  paramsIdSchema,
  createProductoSchema,
  updateProductoSchema,
  queryProductoSchema,
} from "../../schemas/index.js";

const router = Router();

router.get(
  "/",
  auth,
  validate(queryProductoSchema, "query"),
  productoController.findAll,
);
router.get(
  "/:id",
  auth,
  validate(paramsIdSchema, "params"),
  productoController.findById,
);
router.post(
  "/",
  auth,
  roleGuard("ADMIN", "EMPLEADO"),
  validate(createProductoSchema, "body"),
  auditLog('Producto'),
  productoController.create,
);
router.put(
  "/:id",
  auth,
  roleGuard("ADMIN"),

  validate(paramsIdSchema, "params"),
  validate(updateProductoSchema, "body"),
  auditLog('Producto'),
  productoController.update,
);
router.delete(
  "/:id",
  auth,
  roleGuard("ADMIN"),
  validate(paramsIdSchema, "params"),
  auditLog('Producto'),
  productoController.remove,
);

export default router;
