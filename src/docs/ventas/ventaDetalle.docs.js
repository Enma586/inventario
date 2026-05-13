/**
 * @file src/docs/ventaDetalle.docs.js
 * @description Documentación de endpoints para las líneas de detalle de una venta.
 */

import { z } from 'zod';
import { registry } from '../../config/swagger.js';
import {
  createVentaDetalleSchema,
  updateVentaDetalleSchema
} from '../../schemas/ventas/ventaDetalle.schema.js';

const DETALLES_TAG = ['Ventas - Detalles'];

registry.registerPath({
  method: 'get',
  path: '/api/ventas/{id_venta}/detalles',
  tags: DETALLES_TAG,
  summary: 'Listar productos de una factura específica',
  security: [{ cookieAuth: [] }],
  request: { params: z.object({ id_venta: z.string().uuid() }) },
  responses: { 200: { description: 'Lista de detalles obtenida.' } }
});

registry.registerPath({
  method: 'post',
  path: '/api/ventas/{id_venta}/detalles',
  tags: DETALLES_TAG,
  summary: 'Agregar producto a factura existente',
  security: [{ cookieAuth: [] }],
  request: {
    params: z.object({ id_venta: z.string().uuid() }),
    body: { content: { 'application/json': { schema: createVentaDetalleSchema } } }
  },
  responses: { 201: { description: 'Producto agregado al detalle.' } }
});

registry.registerPath({
  method: 'put',
  path: '/api/ventas/detalles/{id}',
  tags: DETALLES_TAG,
  summary: 'Modificar cantidad o precio de un detalle',
  security: [{ cookieAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: { content: { 'application/json': { schema: updateVentaDetalleSchema } } }
  },
  responses: { 200: { description: 'Detalle actualizado.' } }
});