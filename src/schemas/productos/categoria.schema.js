/**
 * @file src/schemas/productos/categoria.schema.js
 * @description Zod schemas para Categoria.
 */

import { z } from 'zod';
import { paginationSchema } from '../pagination.fields.js';

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
});

export const updateCategoriaSchema = z.object({
  nombre: z.string().trim().min(1).max(100).optional(),
  descripcion: z.string().trim().max(500).optional().nullable(),
});

export const queryCategoriaSchema = paginationSchema.extend({
  search: z.string().optional(),
});