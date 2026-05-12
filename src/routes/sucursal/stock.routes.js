import { Router } from "express";
import { stockController } from "../../controllers/index.js";
import { auth, validate, roleGuard, auditLog } from "../../middlewares/index.js";
import {
  createStockSchema,
  updateStockSchema,
  stockParamsSchema,
  queryStockSchema,
} from "../../schemas/index.js";

const router = Router();

router.get(
  "/bajo",
  auth,
  validate(queryStockSchema, "query"),
  stockController.bajo,
);
router.get(
  "/",
  auth,
  validate(queryStockSchema, "query"),
  stockController.findAll,
);
router.post(
  "/",
  auth,
  roleGuard("ADMIN", "EMPLEADO"),
  validate(createStockSchema, "body"),
  auditLog('Stock'),
  stockController.upsert,
);
router.get(
  "/:id_producto/:id_sucursal",
  auth,
  validate(stockParamsSchema, "params"),
  stockController.findByProductoSucursal,
);
router.put(
  "/:id_producto/:id_sucursal",
  auth,
  roleGuard("ADMIN"),
  validate(stockParamsSchema, "params"),
  validate(updateStockSchema, "body"),
  auditLog('Stock'),
  stockController.updateCantidad,
);
router.delete(
  "/:id_producto/:id_sucursal",
  auth,
  roleGuard("ADMIN"),

  validate(stockParamsSchema, "params"),
  auditLog('Stock'),
  stockController.remove,
);

export default router;
