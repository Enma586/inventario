/**
 * @file src/schemas/compras/index.js
 * @description Barrido de schemas del módulo Compras.
 */

export {
  createCompraSchema,
  updateCompraSchema,
  queryCompraSchema,
  createCompraCompletaSchema
} from './compra.schema.js';

export {
  createCompraDetalleSchema,
  createCompraDetalleBulkSchema,
  updateCompraDetalleSchema,
} from './compraDetalle.schema.js';