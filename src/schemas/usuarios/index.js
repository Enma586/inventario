/**
 * @file src/schemas/usuarios/index.js
 * @description Barrido de schemas del módulo Usuarios.
 */

export {
  createUsuarioSchema,
  loginSchema,
  updateUsuarioSchema,
  queryUsuarioSchema,
  registerUsuarioSchema,
  registerSchema
} from './usuario.schema.js';

export {
  createEmpleadoSchema,
  updateEmpleadoSchema,
  queryEmpleadoSchema,
} from './empleado.schema.js';