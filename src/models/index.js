/**
 * @file src/models/index.js
 * @description Orquestador principal de modelos.
 *
 *              Flujo:
 *              1. Importa todos los barridos (sub-índices) de cada módulo.
 *              2. Los agrupa en un objeto `models`.
 *              3. Itera sobre cada modelo y ejecuta `model.associate(models)`
 *                 para inicializar todas las relaciones (Foreign Keys).
 *              4. Exporta `sequelize` (instancia) y `models` para uso en el resto de la app.
 */

import sequelize from '../config/db.js';

// ─── Barridos de cada módulo ──────────────────────────────────────
import * as usuarios from './usuarios/index.js';
import * as productos from './productos/index.js';
import * as sucursal from './sucursal/index.js';
import * as ventas from './ventas/index.js';
import * as compras from './compras/index.js';
import * as ubicacion from './ubicacion/index.js';
import * as bitacora from './bitacora/index.js';

// ─── Agrupación de todos los modelos ─────────────────────────────
const models = {
  ...usuarios,
  ...productos,
  ...sucursal,
  ...ventas,
  ...compras,
  ... ubicacion,
  ... bitacora,
};

// ─── Inicialización de asociaciones ──────────────────────────────
Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

export { sequelize };
export default models;