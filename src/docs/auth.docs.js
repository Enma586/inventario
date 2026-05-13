/**
 * @file src/docs/auth.docs.js
 * @description Documentación de endpoints de autenticación.
 */

import { registry } from '../config/swagger.js';
import { 
  registerUsuarioSchema, 
  loginSchema 
} from '../schemas/usuarios/usuario.schema.js';

registry.registerPath({
  method: 'post',
  path: '/api/auth/register',
  tags: ['Autenticación'],
  summary: 'Registrar un nuevo usuario junto con su perfil de empleado',
  request: {
    body: {
      content: {
        'application/json': { schema: registerUsuarioSchema }
      }
    }
  },
  responses: {
    201: { description: 'Usuario registrado exitosamente' },
    400: { description: 'Errores de validación' }
  }
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/login',
  tags: ['Autenticación'],
  summary: 'Iniciar sesión y obtener la cookie de acceso',
  request: {
    body: {
      content: {
        'application/json': { schema: loginSchema }
      }
    }
  },
  responses: {
    200: { description: 'Inicio de sesión exitoso' },
    401: { description: 'Credenciales inválidas' }
  }
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/logout',
  tags: ['Autenticación'],
  summary: 'Cerrar sesión (elimina la cookie httpOnly)',
  security: [{ cookieAuth: [] }],
  responses: {
    200: { description: 'Sesión cerrada exitosamente' }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/auth/me',
  tags: ['Autenticación'],
  summary: 'Obtener los datos del usuario autenticado actual',
  security: [{ cookieAuth: [] }],
  responses: {
    200: { description: 'Datos del usuario obtenidos exitosamente' },
    401: { description: 'No autorizado - Token faltante o inválido' }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/auth/verify',
  tags: ['Autenticación'],
  summary: 'Verificar la validez del token actual',
  security: [{ cookieAuth: [] }],
  responses: {
    200: { description: 'Token válido' },
    401: { description: 'No autorizado - Token faltante o inválido' }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/auth/renew',
  tags: ['Autenticación'],
  summary: 'Renovar el token de sesión y refrescar la cookie',
  security: [{ cookieAuth: [] }],
  responses: {
    200: { description: 'Token renovado exitosamente' },
    401: { description: 'No autorizado - Token faltante o inválido' },
    404: { description: 'Usuario no encontrado o inactivo' }
  }
});