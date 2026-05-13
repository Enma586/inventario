/**
 * @file src/docs/usuarios.docs.js
 * @description Documentación de endpoints de gestión de usuarios.
 */

import { z } from 'zod';
import { registry } from '../config/swagger.js';
import { 
  createUsuarioSchema, 
  queryUsuarioSchema, 
  updateUsuarioSchema 
} from '../schemas/usuarios/usuario.schema.js';

registry.registerPath({
  method: 'post',
  path: '/api/usuarios',
  tags: ['Usuarios'],
  summary: 'Crear un usuario directamente (requiere id_empleado existente)',
  security: [{ cookieAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': { schema: createUsuarioSchema }
      }
    }
  },
  responses: {
    201: { description: 'Usuario creado exitosamente' },
    400: { description: 'Errores de validación' }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/usuarios',
  tags: ['Usuarios'],
  summary: 'Obtener lista de usuarios con paginación y filtros',
  security: [{ cookieAuth: [] }],
  request: {
    query: queryUsuarioSchema
  },
  responses: {
    200: { description: 'Lista de usuarios obtenida exitosamente' }
  }
});

registry.registerPath({
  method: 'put',
  path: '/api/usuarios/{id}',
  tags: ['Usuarios'],
  summary: 'Actualizar los datos o estado de un usuario',
  security: [{ cookieAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: {
        'application/json': { schema: updateUsuarioSchema }
      }
    }
  },
  responses: {
    200: { description: 'Usuario actualizado exitosamente' },
    400: { description: 'Errores de validación o UUID inválido' },
    404: { description: 'Usuario no encontrado' }
  }
});