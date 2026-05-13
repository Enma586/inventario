/**
 * @file src/docs/productos.docs.js
 * @description Documentación de endpoints para la gestión del catálogo de productos.
 */

import { z } from 'zod';
import { registry } from '../../config/swagger.js';
import {
  createProductoSchema,
  updateProductoSchema,
  queryProductoSchema
} from '../../schemas/productos/producto.schema.js';

registry.registerPath({
  method: 'post',
  path: '/api/productos',
  tags: ['Productos'],
  summary: 'Registrar un nuevo producto en el catálogo',
  security: [{ cookieAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': { schema: createProductoSchema }
      }
    }
  },
  responses: {
    201: { description: 'Producto creado exitosamente' },
    400: { description: 'Errores de validación en la solicitud' },
    409: { description: 'Conflicto - El SKU del producto ya existe' }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/productos',
  tags: ['Productos'],
  summary: 'Obtener lista de productos con soporte para paginación y filtros',
  security: [{ cookieAuth: [] }],
  request: {
    query: queryProductoSchema
  },
  responses: {
    200: { description: 'Lista de productos obtenida exitosamente' }
  }
});

registry.registerPath({
  method: 'put',
  path: '/api/productos/{id}',
  tags: ['Productos'],
  summary: 'Actualizar los datos de un producto existente',
  security: [{ cookieAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: {
        'application/json': { schema: updateProductoSchema }
      }
    }
  },
  responses: {
    200: { description: 'Producto actualizado exitosamente' },
    400: { description: 'Errores de validación o UUID inválido' },
    404: { description: 'Producto no encontrado' }
  }
});

registry.registerPath({
  method: 'delete',
  path: '/api/productos/{id}',
  tags: ['Productos'],
  summary: 'Eliminar un producto del sistema',
  security: [{ cookieAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() })
  },
  responses: {
    200: { description: 'Producto eliminado exitosamente' },
    404: { description: 'Producto no encontrado' }
  }
});