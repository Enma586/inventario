/**
 * @file src/services/sucursal/index.js
 * @description Barrido del módulo Sucursal.
 */

export {
  createSucursal,
  findAllSucursales,
  findSucursalById,
  updateSucursal,
  removeSucursal,
} from './sucursal.service.js';

export {
  upsertStock,
  findStockByProductoAndSucursal,
  findAllStocks,
  updateStockCantidad,
  removeStock,
  getStockBajo,
} from './stock.service.js';