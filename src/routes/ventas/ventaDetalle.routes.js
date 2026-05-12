import { Router } from "express";
import { ventaDetalleController } from "../../controllers/index.js";
import { auth, validate, auditLog } from "../../middlewares/index.js";
import {
  paramsIdSchema,
  createVentaDetalleSchema,
  updateVentaDetalleSchema,
} from "../../schemas/index.js";

const router = Router({ mergeParams: true });

router.post(
  "/",
  auth,
  validate(createVentaDetalleSchema, "body"),
  auditLog('VentaDetalle'),
  ventaDetalleController.create,
);
router.put(
  "/:id",
  auth,
  validate(paramsIdSchema, "params"),
  validate(updateVentaDetalleSchema, "body"),
  auditLog('VentaDetalle'),
  ventaDetalleController.update,
);
router.delete(
  "/:id",
  auth,
  validate(paramsIdSchema, "params"),
  auditLog('VentaDetalle'),
  ventaDetalleController.remove,
);

export default router;
