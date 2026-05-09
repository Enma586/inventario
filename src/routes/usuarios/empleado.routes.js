import { Router } from "express";
import { empleadoController } from "../../controllers/index.js";
import { auth, validate, roleGuard } from "../../middlewares/index.js";
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
  empleadoController.create,
);
router.put(
  "/:id",
  auth,
  roleGuard("ADMIN"),
  validate(paramsIdSchema, "params"),
  validate(updateEmpleadoSchema, "body"),
  empleadoController.update,
);
router.delete(
  "/:id",
  auth,
  roleGuard("ADMIN"),
  validate(paramsIdSchema, "params"),
  empleadoController.remove,
);

export default router;
