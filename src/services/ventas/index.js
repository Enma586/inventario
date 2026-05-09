/**
 * @file src/services/ventas/index.js
 * @description Barrido del módulo Ventas (DTE).
 */

export {
  createVentaCompleta,
  findAllVentas,
  findVentaById,
  updateVenta,
  anularVenta,
  generarNumeroFactura,
} from './venta.service.js';

export {
  addDetalleVenta,
  updateDetalleVenta,
  removeDetalleVenta,
} from './ventaDetalle.service.js';