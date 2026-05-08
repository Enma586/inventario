/**
 * @file src/constants/pagination.constants.js
 * @description Valores por defecto para paginación de endpoints list.
 */

export const PAGINATION = Object.freeze({
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
});

/** Ordenamiento por defecto para consultas paginadas (campo + dirección). */
export const DEFAULT_SORT = Object.freeze({
  FIELD: 'createdAt',
  ORDER: 'DESC',
});