/**
 * @file src/docs/compras.docs.js
 * @description Documentación de endpoints para Compras (Orden de Compra).
 */

import { z } from 'zod';
import { registry } from '../config/swagger.js';
import {
  createCompraCompletaSchema,
  updateCompraSchema,
  queryCompraSchema,
} from '../schemas/compras/compra.schema.js';
import { paramsIdSchema } from '../schemas/index.js'; // Asumiendo que paramsIdSchema está en el index

const COMPRAS_TAG = ['Compras'];

// ─── Cabecera de Compras ─────────────────────────────────────────

registry.registerPath({
  method: 'get',
  path: '/api/compras',
  tags: COMPRAS_TAG,
  summary: 'Listar compras con paginación y filtros',
  security: [{ cookieAuth: [] }],
  request: { query: queryCompraSchema },
  responses: {
    200: { description: 'Lista de compras obtenida.' }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/compras/{id}',
  tags: COMPRAS_TAG,
  summary: 'Obtener una compra específica por su ID',
  security: [{ cookieAuth: [] }],
  request: { params: paramsIdSchema },
  responses: {
    200: { description: 'Detalle de la compra encontrado.' },
    404: { description: 'Compra no encontrada.' }
  }
});

registry.registerPath({
  method: 'post',
  path: '/api/compras',
  tags: COMPRAS_TAG,
  summary: 'Registrar una nueva compra completa (con detalles)',
  description: 'Accesible para ADMIN y EMPLEADO. Genera log de auditoría.',
  security: [{ cookieAuth: [] }],
  request: {
    body: {
      content: { 'application/json': { schema: createCompraCompletaSchema } }
    }
  },
  responses: {
    201: { description: 'Compra registrada exitosamente.' },
    400: { description: 'Error de validación.' }
  }
});

registry.registerPath({
  method: 'put',
  path: '/api/compras/{id}',
  tags: COMPRAS_TAG,
  summary: 'Actualizar datos de una compra',
  description: 'Solo ADMIN. Genera log de auditoría.',
  security: [{ cookieAuth: [] }],
  request: {
    params: paramsIdSchema,
    body: {
      content: { 'application/json': { schema: updateCompraSchema } }
    }
  },
  responses: {
    200: { description: 'Compra actualizada correctamente.' }
  }
});

registry.registerPath({
  method: 'put',
  path: '/api/compras/{id}/cancelar',
  tags: COMPRAS_TAG,
  summary: 'Cancelar una orden de compra',
  description: 'Solo ADMIN. Cambia el estado de la compra a cancelado.',
  security: [{ cookieAuth: [] }],
  request: { params: paramsIdSchema },
  responses: {
    200: { description: 'Compra cancelada exitosamente.' }
  }
});