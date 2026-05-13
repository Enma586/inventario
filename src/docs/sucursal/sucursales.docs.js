/**
 * @file src/docs/sucursales.docs.js
 * @description Documentación de endpoints para la gestión de sucursales.
 */

import { z } from 'zod';
import { registry } from '../../config/swagger.js';
import {
  createSucursalSchema,
  updateSucursalSchema,
  querySucursalSchema
} from '../../schemas/sucursal/sucursal.schema.js';

registry.registerPath({
  method: 'post',
  path: '/api/sucursales',
  tags: ['Sucursales'],
  summary: 'Registrar una nueva sucursal',
  security: [{ cookieAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': { schema: createSucursalSchema }
      }
    }
  },
  responses: {
    201: { description: 'Sucursal creada exitosamente' },
    400: { description: 'Errores de validación' },
    409: { description: 'Conflicto - El nombre de la sucursal ya existe' }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/sucursales',
  tags: ['Sucursales'],
  summary: 'Obtener lista de sucursales con soporte para paginación y filtros',
  security: [{ cookieAuth: [] }],
  request: {
    query: querySucursalSchema
  },
  responses: {
    200: { description: 'Lista de sucursales obtenida exitosamente' }
  }
});

registry.registerPath({
  method: 'put',
  path: '/api/sucursales/{id}',
  tags: ['Sucursales'],
  summary: 'Actualizar los datos de una sucursal existente',
  security: [{ cookieAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: {
        'application/json': { schema: updateSucursalSchema }
      }
    }
  },
  responses: {
    200: { description: 'Sucursal actualizada exitosamente' },
    400: { description: 'Errores de validación o UUID inválido' },
    404: { description: 'Sucursal no encontrada' }
  }
});

registry.registerPath({
  method: 'delete',
  path: '/api/sucursales/{id}',
  tags: ['Sucursales'],
  summary: 'Eliminar una sucursal del sistema',
  security: [{ cookieAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() })
  },
  responses: {
    200: { description: 'Sucursal eliminada exitosamente' },
    404: { description: 'Sucursal no encontrada' }
  }
});