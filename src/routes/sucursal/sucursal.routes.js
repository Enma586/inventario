import { Router } from "express";
import { sucursalController } from "../../controllers/index.js";
import { auth, roleGuard, validate } from "../../middlewares/index.js";
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
  sucursalController.create,
);
router.put(
  "/:id",
  auth,
  roleGuard("ADMIN"),
  validate(paramsIdSchema, "params"),
  validate(updateSucursalSchema, "body"),
  sucursalController.update,
);
router.delete(
  "/:id",
  auth,
  roleGuard("ADMIN"),
  validate(paramsIdSchema, "params"),
  sucursalController.remove,
);

export default router;
