import { Router } from "express";
import { productoController } from "../../controllers/index.js";
import { auth, validate, roleGuard } from "../../middlewares/index.js";
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
  productoController.create,
);
router.put(
  "/:id",
  auth,
  roleGuard("ADMIN"),

  validate(paramsIdSchema, "params"),
  validate(updateProductoSchema, "body"),
  productoController.update,
);
router.delete(
  "/:id",
  auth,
  roleGuard("ADMIN"),
  validate(paramsIdSchema, "params"),
  productoController.remove,
);

export default router;
