import { Router } from "express";
import { categoriaController } from "../../controllers/index.js";
import { auth, validate, roleGuard, auditLog } from "../../middlewares/index.js";
import {
  paramsIdSchema,
  createCategoriaSchema,
  updateCategoriaSchema,
  queryCategoriaSchema,
} from "../../schemas/index.js";

const router = Router();

router.get(
  "/",
  auth,
  validate(queryCategoriaSchema, "query"),
  categoriaController.findAll,
);
router.get(
  "/:id",
  auth,
  validate(paramsIdSchema, "params"),
  categoriaController.findById,
);
router.post(
  "/",
  auth,
  roleGuard("ADMIN", "EMPLEADO"),
  validate(createCategoriaSchema, "body"),
  auditLog('Categoria'),
  categoriaController.create,
);
router.put(
  "/:id",
  auth,
  roleGuard("ADMIN"),
  validate(paramsIdSchema, "params"),
  validate(updateCategoriaSchema, "body"),
  auditLog('Categoria'),
  categoriaController.update,
);
router.delete(
  "/:id",
  auth,
  roleGuard("ADMIN"),
  validate(paramsIdSchema, "params"),
  auditLog('Categoria'),
  categoriaController.remove,
);

export default router;
