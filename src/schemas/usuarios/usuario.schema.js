/**
 * @file src/schemas/usuarios/usuario.schema.js
 * @description Zod schemas para Usuario con soporte para OpenAPI.
 */

import { z } from 'zod';
import { ROLES_ARRAY } from '../../constants/index.js';
import { paginationSchema } from '../pagination.fields.js';
import { registry } from '../../config/swagger.js';

// ─── Componentes (Esquemas) ──────────────────────────────────────

export const registerUsuarioSchema = z.object({
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
      .min(6, 'La contraseña debe tener al menos 6 caracteres.'),
    rol: z
      .enum(ROLES_ARRAY)
      .optional()
      .default('EMPLEADO'),
  }),
  empleado: z.object({
    nombres: z
      .string()
      .trim()
      .min(1, 'El nombre es obligatorio.'),
    apellidos: z
      .string()
      .trim()
      .min(1, 'Los apellidos son obligatorios.'),
    dui: z
      .string()
      .trim()
      .regex(/^\d{8}-\d$/, 'El DUI debe tener el formato ########-#'),
  }),
}).openapi('RegisterUsuario');

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
}).openapi('CreateUsuario');

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
}).openapi('Login');

export const updateUsuarioSchema = z.object({
  id_empleado: z.string().uuid().optional(),
  nombre_usuario: z.string().trim().min(3).max(50).optional(),
  email: z.string().trim().email().optional(),
  password: z.string().min(6).max(128).optional(),
  rol: z.enum(ROLES_ARRAY).optional(),
  activo: z.boolean().optional(),
}).openapi('UpdateUsuario');

export const queryUsuarioSchema = paginationSchema.extend({
  rol: z.enum(ROLES_ARRAY).optional(),
  activo: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  search: z.string().optional(),
}).openapi('QueryUsuario');

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
}).openapi('RegisterAlternativo');

// ─── Documentación de Rutas (Endpoints) ──────────────────────────

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
    201: {
      description: 'Usuario registrado exitosamente',
    },
    400: {
      description: 'Errores de validación',
    }
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
    200: {
      description: 'Inicio de sesión exitoso',
    },
    401: {
      description: 'Credenciales inválidas',
    }
  }
});

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
    201: {
      description: 'Usuario creado exitosamente',
    },
    400: {
      description: 'Errores de validación',
    }
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
    200: {
      description: 'Lista de usuarios obtenida exitosamente',
    }
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
    200: {
      description: 'Usuario actualizado exitosamente',
    },
    400: {
      description: 'Errores de validación o UUID inválido',
    },
    404: {
      description: 'Usuario no encontrado',
    }
  }
});
registry.registerPath({
  method: 'post',
  path: '/api/auth/logout',
  tags: ['Autenticación'],
  summary: 'Cerrar sesión (elimina la cookie httpOnly)',
  security: [{ cookieAuth: [] }],
  responses: {
    200: {
      description: 'Sesión cerrada exitosamente',
    }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/auth/me',
  tags: ['Autenticación'],
  summary: 'Obtener los datos del usuario autenticado actual',
  security: [{ cookieAuth: [] }],
  responses: {
    200: {
      description: 'Datos del usuario obtenidos exitosamente',
    },
    401: {
      description: 'No autorizado - Token faltante o inválido',
    }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/auth/verify',
  tags: ['Autenticación'],
  summary: 'Verificar la validez del token actual',
  security: [{ cookieAuth: [] }],
  responses: {
    200: {
      description: 'Token válido',
    },
    401: {
      description: 'No autorizado - Token faltante o inválido',
    }
  }
});

registry.registerPath({
  method: 'get',
  path: '/api/auth/renew',
  tags: ['Autenticación'],
  summary: 'Renovar el token de sesión y refrescar la cookie',
  security: [{ cookieAuth: [] }],
  responses: {
    200: {
      description: 'Token renovado exitosamente',
    },
    401: {
      description: 'No autorizado - Token faltante o inválido',
    },
    404: {
      description: 'Usuario no encontrado o inactivo',
    }
  }
});