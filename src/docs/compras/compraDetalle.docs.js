/**
 * @file src/docs/compras.docs.js
 * @description Documentación de endpoints para la gestión de líneas de detalle en compras.
 */

import { z } from 'zod';
import { registry } from '../../config/swagger.js';
import {
  createCompraDetalleSchema,
  updateCompraDetalleSchema
} from '../../schemas/compras/compraDetalle.schema.js';

registry.registerPath({
  method: 'post',
  path: '/api/compras/{id_compra}/detalles',
  tags: ['Compras - Detalles'],
  summary: 'Agregar una línea de detalle a una compra existente',
  security: [{ cookieAuth: [] }],
  request: {
    params: z.object({ id_compra: z.string().uuid() }),
    body: {
      content: {
        'application/json': { schema: createCompraDetalleSchema }
      }
    }
  },
  responses: {
    201: { description: 'Detalle creado exitosamente' },
    400: { description: 'Error en los datos de entrada' }
  }
});



registry.registerPath({
  method: 'put',
  path: '/api/compras/detalles/{id}',
  tags: ['Compras - Detalles'],
  summary: 'Actualizar cantidad o costo de una línea de detalle específica',
  security: [{ cookieAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: {
        'application/json': { schema: updateCompraDetalleSchema }
      }
    }
  },
  responses: {
    200: { description: 'Detalle actualizado exitosamente' }
  }
});

registry.registerPath({
  method: 'delete',
  path: '/api/compras/detalles/{id}',
  tags: ['Compras - Detalles'],
  summary: 'Eliminar una línea de detalle de la base de datos',
  security: [{ cookieAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() })
  },
  responses: {
    200: { description: 'Detalle eliminado exitosamente' }
  }
});