/**
 * @file src/schemas/productos/proveedor.schema.js
 * @description Zod schemas para Proveedor con soporte para OpenAPI.
 */

import { z } from 'zod';
import { paginationSchema } from '../pagination.fields.js';
import { registry } from '../../config/swagger.js';

// ─── Componentes (Esquemas) ──────────────────────────────────────

export const createProveedorSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, 'El nombre del proveedor es obligatorio.')
    .max(150, 'El nombre no puede exceder 150 caracteres.'),
  contacto: z
    .string()
    .trim()
    .max(200)
    .optional()
    .nullable(),
}).openapi('CreateProveedor');

export const updateProveedorSchema = z.object({
  nombre: z.string().trim().min(1).max(150).optional(),
  contacto: z.string().trim().max(200).optional().nullable(),
}).openapi('UpdateProveedor');

export const queryProveedorSchema = paginationSchema.extend({
  search: z.string().optional(),
}).openapi('QueryProveedor');

// ─── Documentación de Rutas (Endpoints) ──────────────────────────

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
    201: {
      description: 'Proveedor creado exitosamente',
    },
    400: {
      description: 'Errores de validación en la solicitud',
    },
    409: {
      description: 'Conflicto - El nombre del proveedor ya existe',
    }
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
    200: {
      description: 'Lista de proveedores obtenida exitosamente',
    }
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
    200: {
      description: 'Proveedor actualizado exitosamente',
    },
    400: {
      description: 'Errores de validación en la solicitud o UUID inválido',
    },
    404: {
      description: 'Proveedor no encontrado',
    }
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
    200: {
      description: 'Proveedor eliminado exitosamente',
    },
    404: {
      description: 'Proveedor no encontrado',
    }
  }
});