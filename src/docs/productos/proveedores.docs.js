/**
 * @file src/docs/proveedores.docs.js
 * @description Documentación de endpoints para la gestión de Proveedores.
 */

import { z } from 'zod';
import { registry } from '../../config/swagger.js';
import {
  createProveedorSchema,
  updateProveedorSchema,
  queryProveedorSchema
} from '../schemas/proveedor/proveedor.schema.js';

registry.registerPath({
  method: 'post',
  path: '/api/proveedores',
  tags: ['Proveedores'],
  summary: 'Registrar un nuevo proveedor',
  security: [{ cookieAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': { schema: createProveedorSchema }
      }
    }
  },
  responses: {
    201: { description: 'Proveedor creado exitosamente' },
    400: { description: 'Errores de validación en la solicitud' },
    409: { description: 'Conflicto - El nombre del proveedor ya existe' }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/proveedores',
  tags: ['Proveedores'],
  summary: 'Obtener lista de proveedores con soporte para paginación y búsqueda',
  security: [{ cookieAuth: [] }],
  request: {
    query: queryProveedorSchema
  },
  responses: {
    200: { description: 'Lista de proveedores obtenida exitosamente' }
  }
});

registry.registerPath({
  method: 'put',
  path: '/api/proveedores/{id}',
  tags: ['Proveedores'],
  summary: 'Actualizar los datos de un proveedor existente',
  security: [{ cookieAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: {
        'application/json': { schema: updateProveedorSchema }
      }
    }
  },
  responses: {
    200: { description: 'Proveedor actualizado exitosamente' },
    400: { description: 'Errores de validación o UUID inválido' },
    404: { description: 'Proveedor no encontrado' }
  }
});

registry.registerPath({
  method: 'delete',
  path: '/api/proveedores/{id}',
  tags: ['Proveedores'],
  summary: 'Eliminar un proveedor del sistema',
  security: [{ cookieAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() })
  },
  responses: {
    200: { description: 'Proveedor eliminado exitosamente' },
    404: { description: 'Proveedor no encontrado' }
  }
});