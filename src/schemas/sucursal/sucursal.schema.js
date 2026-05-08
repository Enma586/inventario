/**
 * @file src/schemas/sucursal/sucursal.schema.js
 * @description Zod schemas para Sucursal (creación, actualización y consulta).
 */

import { z } from 'zod';
import { paginationSchema } from '../pagination.fields.js';

export const createSucursalSchema = z.object({
  id_distrito: z
    .string()
    .uuid('El ID del distrito debe ser un UUID válido.'),
  nombre: z
    .string()
    .trim()
    .min(1, 'El nombre de la sucursal es obligatorio.')
    .max(100, 'El nombre no puede exceder los 100 caracteres.'),
  direccion: z
    .string()
    .trim()
    .min(1, 'La dirección es obligatoria.')
    .max(255, 'La dirección no puede exceder los 255 caracteres.'),
  activa: z
    .boolean()
    .optional()
    .default(true),
});

export const updateSucursalSchema = z.object({
  id_distrito: z.string().uuid('El ID del distrito debe ser un UUID válido.').optional(),
  nombre: z.string().trim().min(1).max(100).optional(),
  direccion: z.string().trim().min(1).max(255).optional(),
  activa: z.boolean().optional(),
});

export const querySucursalSchema = paginationSchema.extend({
  search: z.string().optional(), // Para buscar por nombre o dirección
  id_distrito: z.string().uuid('El ID del distrito debe ser un UUID válido.').optional(),
  activa: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
});