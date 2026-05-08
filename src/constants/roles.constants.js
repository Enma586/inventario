/**
 * @file src/constants/roles.constants.js
 * @description Valores ENUM para el campo `rol` del modelo Empleado.
 */

export const ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  EMPLEADO: 'EMPLEADO',
});

export const ROLES_ARRAY = Object.values(ROLES);