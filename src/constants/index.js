/**
 * @file src/constants/index.js
 * @description Archivo de barrido (orquestador de constantes).
 *              Centraliza y re-exporta todas las constantes del sistema
 *              para que cualquier módulo pueda importarlas desde un único punto:
 *
 *              import { ROLES, ESTADO_VENTA, PAGINATION } from '../constants/index.js';
 */

// ─── Enums de dominio ────────────────────────────────────────────
export {
  ROLES,
  ROLES_ARRAY,
} from './roles.constants.js';

export {
  ESTADO_PRODUCTO,
  ESTADO_PRODUCTO_ARRAY,
} from './productos.constants.js';

export {
  METODO_PAGO,
  METODO_PAGO_ARRAY,
  ESTADO_VENTA,
  ESTADO_VENTA_ARRAY,
  ESTADO_DTE,
  ESTADO_DTE_ARRAY,
  ESTADOS_DTE_CERRADOS,
} from './ventas.constants.js';

export {
  ESTADO_ENTREGA,
  ESTADO_ENTREGA_ARRAY,
} from './compras.constants.js';

// ─── Configuración ───────────────────────────────────────────────
export {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  JWT_ALGORITHM,
  BCRYPT_SALT_ROUNDS,
  AUTH_HEADER,
  TOKEN_PREFIX,
  JWT_REMEMBER_EXPIRES_IN,
} from './auth.constants.js';

export {
  PAGINATION,
  DEFAULT_SORT,
} from './pagination.constants.js';

export {
  HTTP_STATUS,
} from './httpStatus.constants.js';