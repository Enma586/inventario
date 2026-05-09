/**
 * @file src/services/index.js
 * @description Barrido central de servicios.
 *              Cada módulo tiene su propio barrido (index.js).
 *              Este archivo re-exporta todo desde un solo punto.
 */

// ─── Helpers ─────────────────────────────────────────────────────
export { sequelizePaginate } from './helpers.js';

// ─── Barridos de módulo ──────────────────────────────────────────
export * from './usuarios/index.js';
export * from './productos/index.js';
export * from './sucursal/index.js';
export * from './ventas/index.js';
export * from './compras/index.js';