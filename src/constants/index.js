// Constantes técnicas para la Base de Datos y Lógica
export const STATUS_PRODUCT = Object.freeze([
  'DISPONIBLE',
  'DESCONTINUADO',
  'AGOTADO'
]);

export const STATUS_ORDER = Object.freeze([
  'PENDIENTE',
  'RECIBIDO',
  'CANCELADO'
]);

export const METHODS_PAYMENT = Object.freeze([
  'EFECTIVO',
  'TARJETA_CREDITO',
  'TRANSFERENCIA_BANCARIA'
]);

// Diccionario para mostrar nombres legibles en el Frontend (React)
export const DISPLAY_LABELS = {
  STATUS: {
    DISPONIBLE: 'Disponible',
    DESCONTINUADO: 'Descontinuado',
    AGOTADO: 'Agotado'
  },
  ORDER: {
    PENDIENTE: 'Pendiente',
    RECIBIDO: 'Recibido',
    CANCELADO: 'Cancelado'
  },
  PAYMENT: {
    EFECTIVO: 'Efectivo',
    TARJETA_CREDITO: 'Tarjeta de crédito',
    TRANSFERENCIA_BANCARIA: 'Transferencia bancaria'
  }
};