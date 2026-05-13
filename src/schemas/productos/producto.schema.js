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

