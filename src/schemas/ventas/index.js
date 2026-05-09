/**
 * @file src/schemas/ventas/index.js
 * @description Barrido de schemas del módulo Ventas.
 */

export {
  createVentaSchema,
  updateVentaSchema,
  queryVentaSchema,
  createVentaCompletaSchema
} from './venta.schema.js';

export {
  createVentaDetalleSchema,
  createVentaDetalleBulkSchema,
  updateVentaDetalleSchema,
} from './ventaDetalle.schema.js';