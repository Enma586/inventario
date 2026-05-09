/**
 * @file src/schemas/compras/compra.schema.js
 * @description Zod schemas para Compra (orden de compra).
 */

import { z } from 'zod';
import { ESTADO_ENTREGA_ARRAY } from '../../constants/index.js';
import { paginationSchema } from '../pagination.fields.js';

// ─── Crear ───────────────────────────────────────────────────────
export const createCompraSchema = z.object({
  numero_orden: z
    .string()
    .trim()
    .min(1, 'El número de orden es obligatorio.')
    .max(50, 'El número de orden no puede exceder 50 caracteres.'),
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
});

// ─── Actualizar ──────────────────────────────────────────────────
export const updateCompraSchema = z.object({
  total_compra: z.number().int().min(0).optional(),
  estado_entrega: z.enum(ESTADO_ENTREGA_ARRAY).optional(),
});

// ─── Query ───────────────────────────────────────────────────────
export const queryCompraSchema = paginationSchema.extend({
  fechaDesde: z.coerce.date().optional(),
  fechaHasta: z.coerce.date().optional(),
  estado_entrega: z.enum(ESTADO_ENTREGA_ARRAY).optional(),
  id_proveedor: z.string().uuid().optional(),
  id_sucursal: z.string().uuid().optional(),
  search: z.string().optional(),
});

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
});