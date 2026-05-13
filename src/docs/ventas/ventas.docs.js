/**
 * @file src/docs/ventas.docs.js
 * @description Documentación de endpoints para la Cabecera de Ventas (Facturación).
 */

import { z } from 'zod';
import { registry } from '../../config/swagger.js';
import {
  createVentaCompletaSchema,
  updateVentaSchema,
  queryVentaSchema,
} from '../../schemas/ventas/venta.schema.js';
import { paramsIdSchema } from '../../schemas/index.js';

const VENTAS_TAG = ['Ventas'];

registry.registerPath({
  method: 'get',
  path: '/api/ventas',
  tags: VENTAS_TAG,
  summary: 'Obtener listado de ventas (Cabeceras)',
  security: [{ cookieAuth: [] }],
  request: { query: queryVentaSchema },
  responses: { 200: { description: 'Lista de ventas obtenida.' } }
});

registry.registerPath({
  method: 'post',
  path: '/api/ventas',
  tags: VENTAS_TAG,
  summary: 'Registrar nueva venta completa (Facturación)',
  security: [{ cookieAuth: [] }],
  request: {
    body: { content: { 'application/json': { schema: createVentaCompletaSchema } } }
  },
  responses: { 201: { description: 'Venta procesada correctamente.' } }
});

registry.registerPath({
  method: 'put',
  path: '/api/ventas/{id}/anular',
  tags: VENTAS_TAG,
  summary: 'Anular una factura',
  description: 'Solo ADMIN. Revierte stock y marca como anulada.',
  security: [{ cookieAuth: [] }],
  request: { params: paramsIdSchema },
  responses: { 200: { description: 'Venta anulada.' } }
});