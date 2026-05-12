import { Router } from "express";
import { compraController } from "../../controllers/index.js";
import { auth, validate, roleGuard, auditLog } from "../../middlewares/index.js";
import {
  paramsIdSchema,
  createCompraCompletaSchema,
  updateCompraSchema,
  queryCompraSchema,
} from "../../schemas/index.js";

const router = Router();

router.get(
  "/",
  auth,
  validate(queryCompraSchema, "query"),
  compraController.findAll,
);
router.get(
  "/:id",
  auth,
  validate(paramsIdSchema, "params"),
  compraController.findById,
);
router.post(
  "/",
  auth,
  roleGuard("ADMIN", "EMPLEADO"),
  validate(createCompraCompletaSchema, "body"),
  auditLog('Compra'),
  compraController.create,
);
router.put(
  "/:id",
  auth,
    roleGuard("ADMIN"),
  validate(paramsIdSchema, "params"),
  validate(updateCompraSchema, "body"),
  auditLog('Compra'),
  compraController.update,
);
router.put(
  "/:id/cancelar",
  auth,
    roleGuard("ADMIN"),
  validate(paramsIdSchema, "params"),
  auditLog('Compra'),
  compraController.cancelar,
);

export default router;
