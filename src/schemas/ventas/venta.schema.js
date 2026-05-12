/**
 * @file src/schemas/ventas/venta.schema.js
 * @description Zod schemas para Venta (cabecera DTE) con soporte para OpenAPI.
 */

import { z } from 'zod';
import {
  METODO_PAGO_ARRAY,
  ESTADO_VENTA_ARRAY,
} from '../../constants/index.js';
import { paginationSchema } from '../pagination.fields.js';
import { registry } from '../../config/swagger.js';

// ─── Componentes (Esquemas) ──────────────────────────────────────

export const createVentaSchema = z.object({
  numero_factura: z
    .string()
    .trim()
    .max(50, 'El número de factura no puede exceder 50 caracteres.')
    .optional(),
  id_sucursal: z
    .string()
    .uuid('ID de sucursal inválido.'),
  id_empleado: z
    .string()
    .uuid('ID de empleado inválido.'),
  cliente_nombre: z
    .string()
    .trim()
    .min(1, 'El nombre del cliente es obligatorio.')
    .max(200, 'El nombre del cliente no puede exceder 200 caracteres.'),
  cliente_nit: z
    .string()
    .trim()
    .min(1, 'El NIT del cliente es obligatorio.')
    .max(20, 'El NIT no puede exceder 20 caracteres.'),
  cliente_email: z
    .string()
    .trim()
    .email('El formato del email no es válido.')
    .optional()
    .nullable(),
  fecha: z.coerce.date().optional().default(() => new Date()),
  total_pagado: z
    .number()
    .int('El total pagado debe ser un entero (centavos).')
    .min(0, 'El total pagado no puede ser negativo.')
    .optional()
    .default(0),
  metodo_pago: z.enum(METODO_PAGO_ARRAY, {
    errorMap: () => ({ message: `El método de pago debe ser: ${METODO_PAGO_ARRAY.join(', ')}.` }),
  }),
  estado: z
    .enum(ESTADO_VENTA_ARRAY)
    .optional()
    .default('PENDIENTE'),
  estado_dte: z
    .string()
    .trim()
    .optional()
    .default('PENDIENTE'),
  codigo_generacion: z
    .string()
    .trim()
    .max(100)
    .optional()
    .nullable(),
  sello_recepcion: z
    .string()
    .trim()
    .optional()
    .nullable(),
}).openapi('VentaBase');

export const updateVentaSchema = z.object({
  estado: z.enum(ESTADO_VENTA_ARRAY).optional(),
  estado_dte: z.string().trim().optional(),
  codigo_generacion: z.string().trim().max(100).optional().nullable(),
  sello_recepcion: z.string().trim().optional().nullable(),
  total_pagado: z.number().int().min(0).optional(),
  metodo_pago: z.enum(METODO_PAGO_ARRAY).optional(),
}).openapi('UpdateVenta');

export const queryVentaSchema = paginationSchema.extend({
  fechaDesde: z.coerce.date().optional(),
  fechaHasta: z.coerce.date().optional(),
  estado: z.enum(ESTADO_VENTA_ARRAY).optional(),
  estado_dte: z.string().optional(),
  metodo_pago: z.enum(METODO_PAGO_ARRAY).optional(),
  id_sucursal: z.string().uuid().optional(),
  id_empleado: z.string().uuid().optional(),
  search: z.string().optional(),
}).openapi('QueryVenta');

export const createVentaCompletaSchema = z.object({
  venta: createVentaSchema,
  detalles: z
    .array(
      z.object({
        id_producto: z.string().uuid('ID de producto inválido.'),
        precio_unitario_venta: z.number().int().min(0),
        cantidad: z.number().int().min(1),
      })
    )
    .min(1, 'Al menos un detalle de venta es obligatorio.'),
}).openapi('CreateVentaCompleta');

// ─── Documentación de Rutas (Endpoints) ──────────────────────────

registry.registerPath({
  method: 'post',
  path: '/api/ventas',
  tags: ['Ventas'],
  summary: 'Registrar una nueva venta con sus respectivos detalles (Facturación)',
  security: [{ cookieAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': { schema: createVentaCompletaSchema }
      }
    }
  },
  responses: {
    201: {
      description: 'Venta registrada exitosamente',
    },
    400: {
      description: 'Errores de validación',
    }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/ventas',
  tags: ['Ventas'],
  summary: 'Obtener listado de ventas con soporte para filtros y paginación',
  security: [{ cookieAuth: [] }],
  request: {
    query: queryVentaSchema
  },
  responses: {
    200: {
      description: 'Lista de ventas obtenida',
    }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/ventas/{id}',
  tags: ['Ventas'],
  summary: 'Obtener el registro detallado de una venta por su ID',
  security: [{ cookieAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() })
  },
  responses: {
    200: {
      description: 'Detalles de la venta',
    },
    404: {
      description: 'Venta no encontrada',
    }
  }
});

registry.registerPath({
  method: 'put',
  path: '/api/ventas/{id}',
  tags: ['Ventas'],
  summary: 'Actualizar estado, método de pago o datos DTE de la venta',
  security: [{ cookieAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: {
        'application/json': { schema: updateVentaSchema }
      }
    }
  },
  responses: {
    200: {
      description: 'Venta actualizada',
    }
  }
});