/**
 * @file src/schemas/usuarios/empleado.schema.js
 * @description Zod schemas minimalistas para Empleado (Solo Nombre y DUI).
 */

import { z } from "zod";
import { paginationSchema } from "../pagination.fields.js";

export const createEmpleadoSchema = z.object({
  nombres: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio.")
    .max(100),
  apellidos: z
    .string()
    .trim()
    .min(1, "Los apellidos son obligatorios.")
    .max(100),
  dui: z
    .string()
    .trim()
    .regex(/^\d{8}-\d$/, "El DUI debe tener el formato ########-#"),
});

export const updateEmpleadoSchema = z.object({
  nombres: z.string().trim().min(1).max(100).optional(),
  apellidos: z.string().trim().min(1).max(100).optional(),
  dui: z
    .string()
    .trim()
    .regex(/^\d{8}-\d$/, "El DUI debe tener el formato ########-#")
    .optional(),
});

export const queryEmpleadoSchema = paginationSchema.extend({
  // El buscador podrá buscar por nombres, apellidos o DUI indistintamente
  search: z.string().optional(),
});