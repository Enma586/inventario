/**
 * @file src/schemas/productos/categoria.schema.js
 * @description Zod schemas para Categoria con soporte para OpenAPI.
 */

import { z } from 'zod';
import { paginationSchema } from '../pagination.fields.js';
import { registry } from '../../config/swagger.js';

// ─── Componentes (Esquemas) ──────────────────────────────────────

export const createCategoriaSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, 'El nombre de la categoría es obligatorio.')
    .max(100, 'El nombre no puede exceder 100 caracteres.'),
  descripcion: z
    .string()
    .trim()
    .max(500)
    .optional()
    .nullable(),
}).openapi('CreateCategoria');

export const updateCategoriaSchema = z.object({
  nombre: z.string().trim().min(1).max(100).optional(),
  descripcion: z.string().trim().max(500).optional().nullable(),
}).openapi('UpdateCategoria');

export const queryCategoriaSchema = paginationSchema.extend({
  search: z.string().optional(),
}).openapi('QueryCategoria');

// ─── Documentación de Rutas (Endpoints) ──────────────────────────

registry.registerPath({
  method: 'post',
  path: '/api/categorias',
  tags: ['Categorias'],
  summary: 'Crear una nueva categoría',
  security: [{ cookieAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': { schema: createCategoriaSchema }
      }
    }
  },
  responses: {
    201: {
      description: 'Categoría creada exitosamente',
    },
    400: {
      description: 'Errores de validación en la solicitud',
    },
    409: {
      description: 'Conflicto - El nombre de la categoría ya existe',
    }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/categorias',
  tags: ['Categorias'],
  summary: 'Obtener lista de categorías con soporte para paginación y búsqueda',
  security: [{ cookieAuth: [] }],
  request: {
    query: queryCategoriaSchema
  },
  responses: {
    200: {
      description: 'Lista de categorías obtenida exitosamente',
    }
  }
});

registry.registerPath({
  method: 'put',
  path: '/api/categorias/{id}',
  tags: ['Categorias'],
  summary: 'Actualizar los datos de una categoría existente',
  security: [{ cookieAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: {
        'application/json': { schema: updateCategoriaSchema }
      }
    }
  },
  responses: {
    200: {
      description: 'Categoría actualizada exitosamente',
    },
    400: {
      description: 'Errores de validación en la solicitud o UUID inválido',
    },
    404: {
      description: 'Categoría no encontrada',
    }
  }
});

registry.registerPath({
  method: 'delete',
  path: '/api/categorias/{id}',
  tags: ['Categorias'],
  summary: 'Eliminar una categoría del sistema',
  security: [{ cookieAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() })
  },
  responses: {
    200: {
      description: 'Categoría eliminada exitosamente',
    },
    404: {
      description: 'Categoría no encontrada',
    }
  }
});