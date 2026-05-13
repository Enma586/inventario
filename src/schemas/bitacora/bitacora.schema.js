import { z } from 'zod';
import { paginationSchema } from '../pagination.fields.js';
import { registry } from '../../config/swagger.js';

export const queryBitacoraSchema = paginationSchema.extend({
  accion: z.enum(['CREATE', 'UPDATE', 'DELETE']).optional(),
  entidad: z
    .enum([
      'Usuario', 'Empleado', 'Producto', 'Categoria', 'Proveedor',
      'Sucursal', 'Stock', 'Venta', 'VentaDetalle', 'Compra', 'CompraDetalle'
    ])
    .optional(),
}).openapi('QueryBitacora');

registry.registerPath({
  method: 'get',
  path: '/api/bitacora',
  tags: ['Bitácora'],
  summary: 'Consultar el registro de auditoría con paginación y filtros',
  security: [{ cookieAuth: [] }],
  request: {
    query: queryBitacoraSchema
  },
  responses: {
    200: { description: 'Entradas de bitácora obtenidas exitosamente' },
    401: { description: 'No autenticado' },
    403: { description: 'Acceso denegado — requiere rol ADMIN' },
  }
});