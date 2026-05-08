/**
 * @file src/schemas/compras/compraDetalle.schema.js
 * @description Zod schemas para CompraDetalle (línea de orden de compra).
 */

import { z } from 'zod';

// ─── Crear ───────────────────────────────────────────────────────
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
});

// ─── Crear lote ──────────────────────────────────────────────────
export const createCompraDetalleBulkSchema = z
  .array(createCompraDetalleSchema)
  .min(1, 'Al menos un detalle de compra es obligatorio.');

// ─── Actualizar ──────────────────────────────────────────────────
export const updateCompraDetalleSchema = z.object({
  cantidad: z.number().int().min(1).optional(),
  costo_unitario: z.number().int().min(0).optional(),
});