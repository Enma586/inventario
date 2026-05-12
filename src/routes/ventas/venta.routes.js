import { Router } from "express";
import { ventaController } from "../../controllers/index.js";
import { auth, validate, roleGuard, auditLog } from "../../middlewares/index.js";
import {
  paramsIdSchema,
  createVentaCompletaSchema,
  updateVentaSchema,
  queryVentaSchema,
} from "../../schemas/index.js";

const router = Router();

router.get(
  "/",
  auth,
  validate(queryVentaSchema, "query"),
  ventaController.findAll,
);
router.get(
  "/:id",
  auth,
  validate(paramsIdSchema, "params"),
  ventaController.findById,
);
router.post(
  "/",
  auth,
  roleGuard("ADMIN", "EMPLEADO"),
  validate(createVentaCompletaSchema, "body"),
  auditLog('Venta'),
  ventaController.create,
);
router.put(
  "/:id",
  auth,
  roleGuard("ADMIN"),
  validate(paramsIdSchema, "params"),
  validate(updateVentaSchema, "body"),
  auditLog('Venta'),
  ventaController.update,
);
router.put(
  "/:id/anular",
  auth,
  roleGuard("ADMIN"),
  validate(paramsIdSchema, "params"),
  auditLog('Venta'),
  ventaController.anular,
);

export default router;
