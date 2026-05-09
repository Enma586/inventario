import { Router } from "express";
import { categoriaController } from "../../controllers/index.js";
import { auth, validate, roleGuard } from "../../middlewares/index.js";
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
  categoriaController.create,
);
router.put(
  "/:id",
  auth,
  roleGuard("ADMIN"),
  validate(paramsIdSchema, "params"),
  validate(updateCategoriaSchema, "body"),
  categoriaController.update,
);
router.delete(
  "/:id",
  auth,
  roleGuard("ADMIN"),
  validate(paramsIdSchema, "params"),
  categoriaController.remove,
);

export default router;
