/**
 * @file src/docs/bitacora.docs.js
 * @description Documentación de endpoints para el sistema de auditoría (Bitácora).
 */

import { registry } from '../config/swagger.js';
import { queryBitacoraSchema } from '../schemas/bitacora/bitacora.schema.js';

registry.registerPath({
  method: 'get',
  path: '/api/bitacora',
  tags: ['Bitácora'],
  summary: 'Consultar el registro de auditoría con paginación y filtros',
  description: 'Permite rastrear quién realizó cambios en las entidades del sistema. Reservado para usuarios con rol ADMIN.',
  security: [{ cookieAuth: [] }],
  request: {
    query: queryBitacoraSchema
  },
  responses: {
    200: { 
      description: 'Historial de auditoría obtenido exitosamente.' 
    },
    401: { 
      description: 'No autenticado — Falta token de sesión.' 
    },
    403: { 
      description: 'Acceso denegado — Se requiere rol de administrador.' 
    },
  }
});