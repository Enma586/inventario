/**
 * @file src/schemas/usuarios/usuario.schema.js
 * @description Zod schemas para Usuario (registro, login, actualización, consulta).
 */

import { z } from 'zod';
import { ROLES_ARRAY } from '../../constants/index.js';
import { paginationSchema } from '../pagination.fields.js';

export const registerUsuarioSchema = z.object({
  nombres: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio.')
    .max(100, 'El nombre no puede exceder 100 caracteres.'),
  apellidos: z
    .string()
    .trim()
    .min(1, 'Los apellidos son obligatorios.')
    .max(100, 'Los apellidos no pueden exceder 100 caracteres.'),
  telefono: z
    .string()
    .trim()
    .max(20)
    .optional()
    .nullable(),
  direccion: z
    .string()
    .trim()
    .max(255)
    .optional()
    .nullable(),
  nombre_usuario: z
    .string()
    .trim()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres.')
    .max(50, 'El nombre de usuario no puede exceder 50 caracteres.'),
  email: z
    .string()
    .trim()
    .email('El formato del email no es válido.'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres.')
    .max(128, 'La contraseña no puede exceder 128 caracteres.'),
  rol: z
    .enum(ROLES_ARRAY, {
      errorMap: () => ({ message: `El rol debe ser uno de: ${ROLES_ARRAY.join(', ')}.` }),
    })
    .optional()
    .default('EMPLEADO'),
});

export const createUsuarioSchema = z.object({
  id_empleado: z
    .string()
    .uuid('El ID de empleado debe ser un UUID válido.'),
  nombre_usuario: z
    .string()
    .trim()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres.')
    .max(50, 'El nombre de usuario no puede exceder 50 caracteres.'),
  email: z
    .string()
    .trim()
    .email('El formato del email no es válido.'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres.')
    .max(128, 'La contraseña no puede exceder 128 caracteres.'),
  rol: z
    .enum(ROLES_ARRAY, {
      errorMap: () => ({ message: `El rol debe ser uno de: ${ROLES_ARRAY.join(', ')}.` }),
    })
    .optional()
    .default('EMPLEADO'),
  activo: z.boolean().optional().default(true),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('El formato del email no es válido.'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria.'),
  rememberMe: z
    .boolean()
    .optional()
    .default(false),
});

export const updateUsuarioSchema = z.object({
  id_empleado: z.string().uuid().optional(),
  nombre_usuario: z.string().trim().min(3).max(50).optional(),
  email: z.string().trim().email().optional(),
  password: z.string().min(6).max(128).optional(),
  rol: z.enum(ROLES_ARRAY).optional(),
  activo: z.boolean().optional(),
});

export const queryUsuarioSchema = paginationSchema.extend({
  rol: z.enum(ROLES_ARRAY).optional(),
  activo: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  search: z.string().optional(),
});

export const registerSchema = z.object({
  usuario: z.object({
    nombre_usuario: z
      .string()
      .trim()
      .min(3, 'El nombre de usuario debe tener al menos 3 caracteres.')
      .max(50),
    email: z
      .string()
      .trim()
      .email('El formato del email no es válido.'),
    password: z
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres.')
      .max(128),
    rol: z
      .enum(ROLES_ARRAY)
      .optional()
      .default('EMPLEADO'),
  }),
  empleado: z.object({
    nombres: z
      .string()
      .trim()
      .min(1, 'El nombre del empleado es obligatorio.')
      .max(100),
    apellidos: z
      .string()
      .trim()
      .min(1, 'Los apellidos del empleado son obligatorios.')
      .max(100),
    telefono: z.string().trim().max(20).optional().nullable(),
    direccion: z.string().trim().max(255).optional().nullable(),
  }),
});