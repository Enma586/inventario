/**
 * @file src/schemas/productos/producto.schema.js
 * @description Zod schemas para Producto con soporte para OpenAPI.
 */

import { z } from 'zod';
import { ESTADO_PRODUCTO_ARRAY } from '../../constants/index.js';
import { paginationSchema } from '../pagination.fields.js';
import { registry } from '../../config/swagger.js';

// ─── Componentes (Esquemas) ──────────────────────────────────────

export const createProductoSchema = z.object({
  sku: z
    .string()
    .trim()
    .min(1, 'El SKU es obligatorio.')
    .max(50, 'El SKU no puede exceder 50 caracteres.'),
  nombre: z
    .string()
    .trim()
    .min(1, 'El nombre del producto es obligatorio.')
    .max(200, 'El nombre no puede exceder 200 caracteres.'),
  id_categoria: z
    .string()
    .uuid('ID de categoría inválido.')
    .optional()
    .nullable(),
  id_proveedor: z
    .string()
    .uuid('ID de proveedor inválido.')
    .optional()
    .nullable(),
  estado: z
    .enum(ESTADO_PRODUCTO_ARRAY, {
      errorMap: () => ({ message: `El estado debe ser: ${ESTADO_PRODUCTO_ARRAY.join(', ')}.` }),
    })
    .optional()
    .default('DISPONIBLE'),
  costo_compra: z
    .number()
    .int('El costo de compra debe ser un entero (centavos).')
    .min(0, 'El costo de compra no puede ser negativo.')
    .optional()
    .default(0),
  precio_venta: z
    .number()
    .int('El precio de venta debe ser un entero (centavos).')
    .min(0, 'El precio de venta no puede ser negativo.')
    .optional()
    .default(0),
}).openapi('CreateProducto');

export const updateProductoSchema = z.object({
  sku: z.string().trim().min(1).max(50).optional(),
  nombre: z.string().trim().min(1).max(200).optional(),
  id_categoria: z.string().uuid().optional().nullable(),
  id_proveedor: z.string().uuid().optional().nullable(),
  estado: z.enum(ESTADO_PRODUCTO_ARRAY).optional(),
  costo_compra: z.number().int().min(0).optional(),
  precio_venta: z.number().int().min(0).optional(),
}).openapi('UpdateProducto');

export const queryProductoSchema = paginationSchema.extend({
  estado: z.enum(ESTADO_PRODUCTO_ARRAY).optional(),
  id_categoria: z.string().uuid().optional(),
  id_proveedor: z.string().uuid().optional(),
  search: z.string().optional(),
  precioMin: z.coerce.number().int().min(0).optional(),
  precioMax: z.coerce.number().int().min(0).optional(),
}).openapi('QueryProducto');

// ─── Documentación de Rutas (Endpoints) ──────────────────────────

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
    201: {
      description: 'Producto creado exitosamente',
    },
    400: {
      description: 'Errores de validación en la solicitud',
    },
    409: {
      description: 'Conflicto - El SKU del producto ya existe',
    }
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
    200: {
      description: 'Lista de productos obtenida exitosamente',
    }
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
    200: {
      description: 'Producto actualizado exitosamente',
    },
    400: {
      description: 'Errores de validación en la solicitud o UUID inválido',
    },
    404: {
      description: 'Producto no encontrado',
    }
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
    200: {
      description: 'Producto eliminado exitosamente',
    },
    404: {
      description: 'Producto no encontrado',
    }
  }
});