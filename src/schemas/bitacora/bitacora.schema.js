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

