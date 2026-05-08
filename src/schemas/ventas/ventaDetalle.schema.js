/**
 * @file src/schemas/ventas/ventaDetalle.schema.js
 * @description Zod schemas para VentaDetalle (línea de factura).
 */

import { z } from 'zod';

// ─── Crear ───────────────────────────────────────────────────────
export const createVentaDetalleSchema = z.object({
  id_venta: z
    .string()
    .uuid('ID de venta inválido.'),
  id_producto: z
    .string()
    .uuid('ID de producto inválido.'),
  nombre_snapshot: z
    .string()
    .trim()
    .min(1, 'El nombre snapshot del producto es obligatorio.')
    .max(200, 'El nombre snapshot no puede exceder 200 caracteres.'),
  precio_unitario_venta: z
    .number()
    .int('El precio unitario debe ser un entero (centavos).')
    .min(0, 'El precio unitario no puede ser negativo.'),
  cantidad: z
    .number()
    .int('La cantidad debe ser un entero.')
    .min(1, 'La cantidad debe ser al menos 1.'),
  subtotal: z
    .number()
    .int('El subtotal debe ser un entero (centavos).')
    .min(0, 'El subtotal no puede ser negativo.'),
});

// ─── Crear lote (array de detalles para una misma venta) ─────────
export const createVentaDetalleBulkSchema = z
  .array(createVentaDetalleSchema)
  .min(1, 'Al menos un detalle de venta es obligatorio.');

// ─── Actualizar ──────────────────────────────────────────────────
export const updateVentaDetalleSchema = z.object({
  precio_unitario_venta: z.number().int().min(0).optional(),
  cantidad: z.number().int().min(1).optional(),
  subtotal: z.number().int().min(0).optional(),
});