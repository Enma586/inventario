/**
 * @file src/schemas/sucursal/index.js
 * @description Barrido de schemas del módulo Sucursal.
 */

export {
  createSucursalSchema,
  updateSucursalSchema,
  querySucursalSchema,
} from './sucursal.schema.js';

export {
  createStockSchema,
  updateStockSchema,
  stockParamsSchema,
  queryStockSchema,
} from './stock.schema.js';