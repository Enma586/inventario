/**
 * @file src/schemas/productos/index.js
 * @description Barrido de schemas del módulo Productos.
 */

export {
  createCategoriaSchema,
  updateCategoriaSchema,
  queryCategoriaSchema,
} from './categoria.schema.js';

export {
  createProveedorSchema,
  updateProveedorSchema,
  queryProveedorSchema,
} from './proveedor.schema.js';

export {
  createProductoSchema,
  updateProductoSchema,
  queryProductoSchema,
} from './producto.schema.js';