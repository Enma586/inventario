/**
 * @file src/constants/ventas.constants.js
 * @description Valores ENUM para los modelos Venta y VentaDetalle.
 *              Incluye constantes específicas del flujo DTE (Facturación Electrónica).
 */

export const METODO_PAGO = Object.freeze({
  EFECTIVO: 'EFECTIVO',
  TARJETA_CREDITO: 'TARJETA_CREDITO',
  TRANSFERENCIA_BANCARIA: 'TRANSFERENCIA_BANCARIA',
});

export const METODO_PAGO_ARRAY = Object.values(METODO_PAGO);

export const ESTADO_VENTA = Object.freeze({
  PENDIENTE: 'PENDIENTE',
  RECIBIDO: 'RECIBIDO',
  CANCELADO: 'CANCELADO',
});

export const ESTADO_VENTA_ARRAY = Object.values(ESTADO_VENTA);

// Nota: estado_dte se define como String en el modelo (no ENUM de DB),
// pero centralizar sus valores posibles aquí evita magic strings dispersos.
export const ESTADO_DTE = Object.freeze({
  PENDIENTE: 'PENDIENTE',
  PROCESANDO: 'PROCESANDO',
  RECHAZADO: 'RECHAZADO',
  CONTINGENCIA: 'CONTINGENCIA',
  RECIBIDO: 'RECIBIDO',
  ANULADO: 'ANULADO',
});

export const ESTADO_DTE_ARRAY = Object.values(ESTADO_DTE);

/** Estados DTE que impiden modificaciones (ventana cerrada en Hacienda). */
export const ESTADOS_DTE_CERRADOS = Object.freeze([
  ESTADO_DTE.RECIBIDO,
  ESTADO_DTE.ANULADO,
]);