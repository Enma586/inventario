/**
 * @file src/docs/stock.docs.js
 * @description Documentación de endpoints para la gestión de Stock e Inventario.
 */

import { z } from 'zod';
import { registry } from '../../config/swagger.js';
import {
  createStockSchema,
  updateStockSchema,
  stockParamsSchema,
  queryStockSchema
} from '../../schemas/sucursal/stock.schema.js';

registry.registerPath({
  method: 'post',
  path: '/api/stocks',
  tags: ['Inventario (Stocks)'],
  summary: 'Crear o actualizar (Upsert) la cantidad de un producto en una sucursal',
  security: [{ cookieAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': { schema: createStockSchema }
      }
    }
  },
  responses: {
    200: { description: 'Stock actualizado exitosamente (Upsert)' },
    201: { description: 'Stock registrado exitosamente' },
    400: { description: 'Errores de validación' }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/stocks',
  tags: ['Inventario (Stocks)'],
  summary: 'Obtener lista general de inventario con paginación y filtros',
  security: [{ cookieAuth: [] }],
  request: {
    query: queryStockSchema
  },
  responses: {
    200: { description: 'Lista de inventario obtenida exitosamente' }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/stocks/bajo',
  tags: ['Inventario (Stocks)'],
  summary: 'Obtener reporte de productos con existencias por debajo del límite sugerido',
  security: [{ cookieAuth: [] }],
  request: {
    query: z.object({ 
      limite: z.coerce.number().int().optional().openapi({ description: 'Cantidad mínima para considerar stock bajo' }) 
    })
  },
  responses: {
    200: { description: 'Reporte de stock bajo obtenido exitosamente' }
  }
});

registry.registerPath({
  method: 'put',
  path: '/api/stocks/{id_producto}/{id_sucursal}',
  tags: ['Inventario (Stocks)'],
  summary: 'Actualizar manualmente la cantidad de stock',
  security: [{ cookieAuth: [] }],
  request: {
    params: stockParamsSchema,
    body: {
      content: {
        'application/json': { schema: updateStockSchema }
      }
    }
  },
  responses: {
    200: { description: 'Cantidad actualizada exitosamente' },
    400: { description: 'Error de validación o parámetros inválidos' }
  }
});

registry.registerPath({
  method: 'delete',
  path: '/api/stocks/{id_producto}/{id_sucursal}',
  tags: ['Inventario (Stocks)'],
  summary: 'Eliminar un registro de inventario (Stock en 0 o retiro definitivo)',
  security: [{ cookieAuth: [] }],
  request: {
    params: stockParamsSchema
  },
  responses: {
    200: { description: 'Registro de stock eliminado' },
    404: { description: 'Registro no encontrado' }
  }
});
registry.registerPath({
  method: 'get',
  path: '/api/stocks/{id_producto}/{id_sucursal}',
  tags: ['Inventario (Stocks)'],
  summary: 'Obtener el stock de un producto específico en una sucursal',
  security: [{ cookieAuth: [] }],
  request: {
    params: stockParamsSchema
  },
  responses: {
    200: { description: 'Registro de stock encontrado' },
    400: { description: 'Parámetros inválidos' },
    404: { description: 'Registro no encontrado' }
  }
});