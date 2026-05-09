/**
 * @file src/constants/auth.constants.js
 * @description Configuración centralizada para JWT y autenticación.
 *              Las claves sensibles se leen de variables de entorno.
 */

export const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';

/** Duración por defecto del token emitido en login/renew. */
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/** Algoritmo de firma (por defecto HS256 es el estándar de jsonwebtoken). */
export const JWT_ALGORITHM = process.env.JWT_ALGORITHM || 'HS256';

/** Cantidad de rondas de salt para bcrypt (cost factor). */
export const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12;

/** Nombre del header donde viaja el token Bearer. */
export const AUTH_HEADER = 'authorization';

/** Prefijo esperado en el header de autorización. */
export const TOKEN_PREFIX = 'Bearer';

/** Duración extendida cuando el usuario marca "Recordarme". */
export const JWT_REMEMBER_EXPIRES_IN = process.env.JWT_REMEMBER_EXPIRES_IN || '24h';