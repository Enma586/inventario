/**
 * @file src/schemas/productos/proveedor.schema.js
 * @description Zod schemas para Proveedor.
 */

import { z } from 'zod';
import { paginationSchema } from '../pagination.fields.js';

export const createProveedorSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, 'El nombre del proveedor es obligatorio.')
    .max(150, 'El nombre no puede exceder 150 caracteres.'),
  contacto: z
    .string()
    .trim()
    .max(200)
    .optional()
    .nullable(),
});

export const updateProveedorSchema = z.object({
  nombre: z.string().trim().min(1).max(150).optional(),
  contacto: z.string().trim().max(200).optional().nullable(),
});

export const queryProveedorSchema = paginationSchema.extend({
  search: z.string().optional(),
});