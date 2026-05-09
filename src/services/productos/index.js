/**
 * @file src/services/productos/index.js
 * @description Barrido del módulo Productos.
 */

export {
  createCategoria,
  findAllCategorias,
  findCategoriaById,
  updateCategoria,
  removeCategoria,
} from './categoria.service.js';

export {
  createProveedor,
  findAllProveedores,
  findProveedorById,
  updateProveedor,
  removeProveedor,
} from './proveedor.service.js';

export {
  createProducto,
  findAllProductos,
  findProductoById,
  findProductoBySku,
  updateProducto,
  removeProducto,
} from './producto.service.js';