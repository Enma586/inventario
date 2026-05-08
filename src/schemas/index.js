/**
 * @file src/schemas/index.js
 * @description Barrido central de schemas Zod.
 *              Re-exporta los helpers de paginación/params y todos
 *              los schemas de validación del sistema.
 */

// ─── Helpers compartidos ─────────────────────────────────────────
export { paginationFields, paginationSchema } from './pagination.fields.js';
export { paramsIdSchema } from './params.js';

// ─── Usuarios ────────────────────────────────────────────────────
export {
  createUsuarioSchema,
  loginSchema,
  updateUsuarioSchema,
  queryUsuarioSchema,
  createEmpleadoSchema,
  updateEmpleadoSchema,
  queryEmpleadoSchema,
} from './usuarios/index.js';

// ─── Productos ───────────────────────────────────────────────────
export {
  createCategoriaSchema,
  updateCategoriaSchema,
  queryCategoriaSchema,
  createProveedorSchema,
  updateProveedorSchema,
  queryProveedorSchema,
  createProductoSchema,
  updateProductoSchema,
  queryProductoSchema,
} from './productos/index.js';

// ─── Sucursal ────────────────────────────────────────────────────
export {
  createSucursalSchema,
  updateSucursalSchema,
  querySucursalSchema,
  createStockSchema,
  updateStockSchema,
  stockParamsSchema,
  queryStockSchema,
} from './sucursal/index.js';

// ─── Ventas ──────────────────────────────────────────────────────
export {
  createVentaSchema,
  updateVentaSchema,
  queryVentaSchema,
  createVentaDetalleSchema,
  createVentaDetalleBulkSchema,
  updateVentaDetalleSchema,
} from './ventas/index.js';

// ─── Compras ─────────────────────────────────────────────────────
export {
  createCompraSchema,
  updateCompraSchema,
  queryCompraSchema,
  createCompraDetalleSchema,
  createCompraDetalleBulkSchema,
  updateCompraDetalleSchema,
} from './compras/index.js';