/**
 * @file src/constants/productos.constants.js
 * @description Valores ENUM para el modelo Producto (campo `estado`).
 */

export const ESTADO_PRODUCTO = Object.freeze({
  DISPONIBLE: 'DISPONIBLE',
  DESCONTINUADO: 'DESCONTINUADO',
  AGOTADO: 'AGOTADO',
});

export const ESTADO_PRODUCTO_ARRAY = Object.values(ESTADO_PRODUCTO);