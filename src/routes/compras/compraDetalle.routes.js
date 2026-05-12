import { Router } from "express";
import { compraDetalleController } from "../../controllers/index.js";
import { auth, validate, auditLog } from "../../middlewares/index.js";
import {
  paramsIdSchema,
  createCompraDetalleSchema,
  updateCompraDetalleSchema,
} from "../../schemas/index.js";

const router = Router({ mergeParams: true });

router.post(
  "/",
  auth,
  validate(createCompraDetalleSchema, "body"),
  auditLog('CompraDetalle'),
  compraDetalleController.create,
);
router.put(
  "/:id",
  auth,
  validate(paramsIdSchema, "params"),
  validate(updateCompraDetalleSchema, "body"),
  auditLog('CompraDetalle'),
  compraDetalleController.update,
);
router.delete(
  "/:id",
  auth,
  validate(paramsIdSchema, "params"),
  auditLog('CompraDetalle'),
  compraDetalleController.remove,
);

export default router;