/**
 * @file src/docs/empleados.docs.js
 * @description Documentación de endpoints para la gestión de empleados.
 */

import { z } from 'zod';
import { registry } from '../config/swagger.js';
import {
  createEmpleadoSchema,
  updateEmpleadoSchema,
  queryEmpleadoSchema
} from '../schemas/usuarios/empleado.schema.js';

registry.registerPath({
  method: 'post',
  path: '/api/empleados',
  tags: ['Empleados'],
  summary: 'Registrar un nuevo empleado',
  security: [{ cookieAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': { schema: createEmpleadoSchema }
      }
    }
  },
  responses: {
    201: { description: 'Empleado creado exitosamente' },
    400: { description: 'Errores de validación en la solicitud' },
    409: { description: 'Conflicto - El DUI ya está registrado' }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/empleados',
  tags: ['Empleados'],
  summary: 'Obtener lista de empleados con soporte para paginación y búsqueda',
  security: [{ cookieAuth: [] }],
  request: {
    query: queryEmpleadoSchema
  },
  responses: {
    200: { description: 'Lista de empleados obtenida exitosamente' }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/empleados/{id}',
  tags: ['Empleados'],
  summary: 'Obtener los detalles de un empleado por su ID',
  security: [{ cookieAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() })
  },
  responses: {
    200: { description: 'Detalles del empleado' },
    400: { description: 'UUID inválido' },
    404: { description: 'Empleado no encontrado' }
  }
});

registry.registerPath({
  method: 'put',
  path: '/api/empleados/{id}',
  tags: ['Empleados'],
  summary: 'Actualizar los datos de un empleado existente',
  security: [{ cookieAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: {
        'application/json': { schema: updateEmpleadoSchema }
      }
    }
  },
  responses: {
    200: { description: 'Empleado actualizado exitosamente' },
    400: { description: 'Errores de validación o UUID inválido' },
    404: { description: 'Empleado no encontrado' }
  }
});

registry.registerPath({
  method: 'delete',
  path: '/api/empleados/{id}',
  tags: ['Empleados'],
  summary: 'Eliminar un empleado del sistema',
  security: [{ cookieAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() })
  },
  responses: {
    200: { description: 'Empleado eliminado exitosamente' },
    404: { description: 'Empleado no encontrado' }
  }
});