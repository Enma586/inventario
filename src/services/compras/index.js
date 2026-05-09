/**
 * @file src/services/compras/index.js
 * @description Barrido del módulo Compras.
 */

export {
  createCompraCompleta,
  findAllCompras,
  findCompraById,
  updateCompra,
  cancelarCompra,
  generarNumeroOrden,
} from './compra.service.js';

export {
  addDetalleCompra,
  updateDetalleCompra,
  removeDetalleCompra,
} from './compraDetalle.service.js';