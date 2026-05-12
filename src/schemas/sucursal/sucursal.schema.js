/**
 * @file src/schemas/sucursal/sucursal.schema.js
 * @description Zod schemas para Sucursal con soporte para OpenAPI.
 */

import { z } from 'zod';
import { paginationSchema } from '../pagination.fields.js';
import { registry } from '../../config/swagger.js';

// ─── Componentes (Esquemas) ──────────────────────────────────────

export const createSucursalSchema = z.object({
  id_distrito: z
    .string()
    .uuid('El ID del distrito debe ser un UUID válido.'),
  nombre: z
    .string()
    .trim()
    .min(1, 'El nombre de la sucursal es obligatorio.')
    .max(100, 'El nombre no puede exceder los 100 caracteres.'),
  direccion: z
    .string()
    .trim()
    .min(1, 'La dirección es obligatoria.')
    .max(255, 'La dirección no puede exceder los 255 caracteres.'),
  activa: z
    .boolean()
    .optional()
    .default(true),
}).openapi('CreateSucursal');

export const updateSucursalSchema = z.object({
  id_distrito: z.string().uuid('El ID del distrito debe ser un UUID válido.').optional(),
  nombre: z.string().trim().min(1).max(100).optional(),
  direccion: z.string().trim().min(1).max(255).optional(),
  activa: z.boolean().optional(),
}).openapi('UpdateSucursal');

export const querySucursalSchema = paginationSchema.extend({
  search: z.string().optional(),
  id_distrito: z.string().uuid('El ID del distrito debe ser un UUID válido.').optional(),
  activa: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
}).openapi('QuerySucursal');

// ─── Documentación de Rutas (Endpoints) ──────────────────────────

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
    201: {
      description: 'Sucursal creada exitosamente',
    },
    400: {
      description: 'Errores de validación',
    },
    409: {
      description: 'Conflicto - El nombre de la sucursal ya existe',
    }
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
    200: {
      description: 'Lista de sucursales obtenida exitosamente',
    }
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
    200: {
      description: 'Sucursal actualizada exitosamente',
    },
    400: {
      description: 'Errores de validación o UUID inválido',
    },
    404: {
      description: 'Sucursal no encontrada',
    }
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
    200: {
      description: 'Sucursal eliminada exitosamente',
    },
    404: {
      description: 'Sucursal no encontrada',
    }
  }
});