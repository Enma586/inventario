/**
 * @file src/schemas/compras/compraDetalle.schema.js
 * @description Zod schemas para CompraDetalle con soporte para OpenAPI.
 */

import { z } from 'zod';
import { registry } from '../../config/swagger.js';

// ─── Componentes (Esquemas) ──────────────────────────────────────

export const createCompraDetalleSchema = z.object({
  id_compra: z
    .string()
    .uuid('ID de compra inválido.'),
  id_producto: z
    .string()
    .uuid('ID de producto inválido.'),
  cantidad: z
    .number()
    .int('La cantidad debe ser un entero.')
    .min(1, 'La cantidad debe ser al menos 1.'),
  costo_unitario: z
    .number()
    .int('El costo unitario debe ser un entero (centavos).')
    .min(0, 'El costo unitario no puede ser negativo.'),
}).openapi('CompraDetalleBase');

export const createCompraDetalleBulkSchema = z
  .array(createCompraDetalleSchema)
  .min(1, 'Al menos un detalle de compra es obligatorio.')
  .openapi('CompraDetalleBulk');

export const updateCompraDetalleSchema = z.object({
  cantidad: z.number().int().min(1).optional(),
  costo_unitario: z.number().int().min(0).optional(),
}).openapi('UpdateCompraDetalle');

// ─── Documentación de Rutas (Endpoints) ──────────────────────────

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
    201: {
      description: 'Detalle creado exitosamente',
    },
    400: {
      description: 'Error en los datos de entrada',
    }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/compras/{id_compra}/detalles',
  tags: ['Compras - Detalles'],
  summary: 'Obtener todos los detalles asociados a una compra',
  security: [{ cookieAuth: [] }],
  request: {
    params: z.object({ id_compra: z.string().uuid() })
  },
  responses: {
    200: {
      description: 'Lista de detalles de la compra',
    }
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
    200: {
      description: 'Detalle actualizado exitosamente',
    }
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
    200: {
      description: 'Detalle eliminado exitosamente',
    }
  }
});