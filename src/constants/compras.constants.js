/**
 * @file src/constants/compras.constants.js
 * @description Valores ENUM para el modelo Compra (campo `estado_entrega`).
 */

export const ESTADO_ENTREGA = Object.freeze({
  PENDIENTE: 'PENDIENTE',
  RECIBIDO: 'RECIBIDO',
  CANCELADO: 'CANCELADO',
});

export const ESTADO_ENTREGA_ARRAY = Object.values(ESTADO_ENTREGA);