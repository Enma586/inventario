/**
 * @file src/schemas/compras/compra.schema.js
 * @description Zod schemas para Compra (orden de compra) con soporte para OpenAPI.
 */

import { z } from 'zod';
import { ESTADO_ENTREGA_ARRAY } from '../../constants/index.js';
import { paginationSchema } from '../pagination.fields.js';
import { registry } from '../../config/swagger.js';

// ─── Componentes (Esquemas) ──────────────────────────────────────

export const createCompraSchema = z.object({
  numero_orden: z
    .string()
    .trim()
    .max(50, 'El número de orden no puede exceder 50 caracteres.')
    .optional(),
  id_proveedor: z
    .string()
    .uuid('ID de proveedor inválido.'),
  id_sucursal: z
    .string()
    .uuid('ID de sucursal inválido.'),
  total_compra: z
    .number()
    .int('El total de compra debe ser un entero (centavos).')
    .min(0, 'El total de compra no puede ser negativo.')
    .optional()
    .default(0),
  estado_entrega: z
    .enum(ESTADO_ENTREGA_ARRAY, {
      errorMap: () => ({ message: `El estado de entrega debe ser: ${ESTADO_ENTREGA_ARRAY.join(', ')}.` }),
    })
    .optional()
    .default('PENDIENTE'),
}).openapi('CompraBase');

export const updateCompraSchema = z.object({
  total_compra: z.number().int().min(0).optional(),
  estado_entrega: z.enum(ESTADO_ENTREGA_ARRAY).optional(),
}).openapi('UpdateCompra');

export const queryCompraSchema = paginationSchema.extend({
  fechaDesde: z.coerce.date().optional(),
  fechaHasta: z.coerce.date().optional(),
  estado_entrega: z.enum(ESTADO_ENTREGA_ARRAY).optional(),
  id_proveedor: z.string().uuid().optional(),
  id_sucursal: z.string().uuid().optional(),
  search: z.string().optional(),
}).openapi('QueryCompra');

export const createCompraCompletaSchema = z.object({
  compra: createCompraSchema,
  detalles: z
    .array(
      z.object({
        id_producto: z.string().uuid('ID de producto inválido.'),
        cantidad: z.number().int().min(1),
        costo_unitario: z.number().int().min(0),
      })
    )
    .min(1, 'Al menos un detalle de compra es obligatorio.'),
}).openapi('CreateCompraCompleta');

// ─── Documentación de Rutas (Endpoints) ──────────────────────────

registry.registerPath({
  method: 'post',
  path: '/api/compras',
  tags: ['Compras'],
  summary: 'Registrar una nueva compra con sus detalles',
  security: [{ cookieAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': { schema: createCompraCompletaSchema }
      }
    }
  },
  responses: {
    201: {
      description: 'Compra registrada exitosamente',
    },
    400: {
      description: 'Errores de validación',
    }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/compras',
  tags: ['Compras'],
  summary: 'Listar compras con paginación y filtros',
  security: [{ cookieAuth: [] }],
  request: {
    query: queryCompraSchema
  },
  responses: {
    200: {
      description: 'Lista de compras',
    }
  }
});

registry.registerPath({
  method: 'put',
  path: '/api/compras/{id}',
  tags: ['Compras'],
  summary: 'Actualizar el estado o total de una compra',
  security: [{ cookieAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: {
        'application/json': { schema: updateCompraSchema }
      }
    }
  },
  responses: {
    200: {
      description: 'Compra actualizada exitosamente',
    }
  }
});