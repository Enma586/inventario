/**
 * @file src/schemas/sucursal/stock.schema.js
 * @description Zod schemas para Stock.
 */

import { z } from 'zod';
import { paginationSchema } from '../pagination.fields.js';

// ─── Crear / Upsert ──────────────────────────────────────────────
export const createStockSchema = z.object({
  id_producto: z
    .string()
    .uuid('ID de producto inválido.'),
  id_sucursal: z
    .string()
    .uuid('ID de sucursal inválido.'),
  cantidad: z
    .number()
    .int('La cantidad debe ser un entero.')
    .min(0, 'La cantidad no puede ser negativa.')
    .optional()
    .default(0),
});

// ─── Actualizar (solo cantidad) ──────────────────────────────────
export const updateStockSchema = z.object({
  cantidad: z
    .number()
    .int('La cantidad debe ser un entero.')
    .min(0, 'La cantidad no puede ser negativa.'),
});

/** Params compuestos para identificar el stock: id_producto + id_sucursal */
export const stockParamsSchema = z.object({
  id_producto: z.string().uuid('ID de producto inválido.'),
  id_sucursal: z.string().uuid('ID de sucursal inválido.'),
});

// ─── Query ───────────────────────────────────────────────────────
export const queryStockSchema = paginationSchema.extend({
  id_sucursal: z.string().uuid().optional(),
  id_producto: z.string().uuid().optional(),
  stockBajo: z.coerce.number().int().min(0).optional(),
  sinStock: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
});