/**
 * @file src/services/productos/producto.service.js
 * @description Servicio de Producto — CRUD con filtros avanzados.
 *              Precios en centavos (Integer).
 */

import { Op } from 'sequelize';
import models from '../../models/index.js';
import { sequelizePaginate } from '../helpers.js';
import { getIO } from '../../config/socket.js';
import { AppError } from '../../utils/AppError.js';

const { Producto, Categoria, Proveedor } = models;

export const createProducto = async (data) => {
  const producto = await Producto.create(data);

  const io = getIO();
  io.emit('producto:created', producto.toJSON());

  return producto;
};

export const findAllProductos = async (query = {}) => {
  const {
    page, limit, sort = 'createdAt', order = 'DESC',
    estado, id_categoria, id_proveedor,
    search, precioMin, precioMax,
  } = query;

  const where = {};
  if (estado) where.estado = estado;
  if (id_categoria) where.id_categoria = id_categoria;
  if (id_proveedor) where.id_proveedor = id_proveedor;
  if (search) {
    where[Op.or] = [
      { nombre: { [Op.iLike]: `%${search}%` } },
      { sku: { [Op.iLike]: `%${search}%` } },
    ];
  }
  if (precioMin || precioMax) {
    where.precio_venta = {};
    if (precioMin) where.precio_venta[Op.gte] = precioMin;
    if (precioMax) where.precio_venta[Op.lte] = precioMax;
  }

  return sequelizePaginate(Producto, {
    page,
    limit,
    where,
    order: [[sort, order]],
    include: [
      { model: Categoria, as: 'categoria' },
      { model: Proveedor, as: 'proveedor' },
    ],
  });
};

export const findProductoById = async (id) => {
  const producto = await Producto.findByPk(id, {
    include: [
      { model: Categoria, as: 'categoria' },
      { model: Proveedor, as: 'proveedor' },
    ],
  });
  if (!producto) throw new AppError('Producto no encontrado.', 404);
  return producto;
};

export const findProductoBySku = async (sku) => {
  return Producto.findOne({
    where: { sku },
    include: [
      { model: Categoria, as: 'categoria' },
      { model: Proveedor, as: 'proveedor' },
    ],
  });
};

export const updateProducto = async (id, data) => {
  const producto = await Producto.findByPk(id);
  if (!producto) throw new AppError('Producto no encontrado.', 404);

  await producto.update(data);
  const updated = await Producto.findByPk(id, {
    include: [
      { model: Categoria, as: 'categoria' },
      { model: Proveedor, as: 'proveedor' },
    ],
  });

  const io = getIO();
  io.emit('producto:updated', updated.toJSON());

  return updated;
};

export const removeProducto = async (id) => {
  const producto = await Producto.findByPk(id);
  if (!producto) throw new AppError('Producto no encontrado.', 404);

  await producto.destroy();

  const io = getIO();
  io.emit('producto:deleted', { id });

  return producto.toJSON();
};