/**
 * @file src/services/sucursal/stock.service.js
 * @description Servicio de Stock — gestión de inventario por sucursal.
 *              Upsert sobre llave compuesta (id_producto, id_sucursal).
 */

import { Op } from 'sequelize';
import models from '../../models/index.js';
import { sequelizePaginate } from '../helpers.js';
import { getIO } from '../../config/socket.js';
import { AppError } from '../../utils/AppError.js';

const { Stock, Producto, Sucursal } = models;

// ─── Upsert (crea o actualiza cantidad) ──────────────────────────
export const upsertStock = async ({ id_producto, id_sucursal, cantidad }) => {
  const [registro, created] = await Stock.upsert(
    {
      id_producto,
      id_sucursal,
      cantidad,
    },
    { returning: true }
  );

  const io = getIO();
  io.emit(`stock:${created ? 'created' : 'updated'}`, registro.toJSON());

  return { stock: registro, created };
};

// ─── Buscar stock específico ─────────────────────────────────────
export const findStockByProductoAndSucursal = async (id_producto, id_sucursal) => {
  const stock = await Stock.findOne({
    where: { id_producto, id_sucursal },
    include: [
      { model: Producto, as: 'producto' },
      { model: Sucursal, as: 'sucursal' },
    ],
  });

  return stock;
};

// ─── Listar stocks con filtros ───────────────────────────────────
export const findAllStocks = async (query = {}) => {
  const {
    page, limit, sort = 'createdAt', order = 'DESC',
    id_sucursal, id_producto, stockBajo, sinStock,
  } = query;

  const where = {};
  if (id_sucursal) where.id_sucursal = id_sucursal;
  if (id_producto) where.id_producto = id_producto;

  if (sinStock) {
    where.cantidad = 0;
  } else if (stockBajo !== undefined) {
    where.cantidad = { [Op.lte]: stockBajo, [Op.gt]: 0 };
  }

  return sequelizePaginate(Stock, {
    page,
    limit,
    where,
    order: [[sort, order]],
    include: [
      { model: Producto, as: 'producto' },
      { model: Sucursal, as: 'sucursal', attributes: ['nombre', 'activa'] },
    ],
  });
};

// ─── Actualizar solo cantidad ────────────────────────────────────
export const updateStockCantidad = async (id_producto, id_sucursal, cantidad) => {
  const stock = await Stock.findOne({ where: { id_producto, id_sucursal } });
  if (!stock) throw new AppError('Stock no encontrado.', 404);

  stock.cantidad = cantidad;
  await stock.save();

  const io = getIO();
  io.emit('stock:updated', stock.toJSON());

  return stock;
};

// ─── Eliminar ────────────────────────────────────────────────────
export const removeStock = async (id_producto, id_sucursal) => {
  const stock = await Stock.findOne({ where: { id_producto, id_sucursal } });
  if (!stock) throw new AppError('Stock no encontrado.', 404);

  await stock.destroy();

  const io = getIO();
  io.emit('stock:deleted', { id_producto, id_sucursal });

  return { id_producto, id_sucursal };
};

// ─── Obtener productos con stock bajo ────────────────────────────
export const getStockBajo = async (limite = 5) => {
  return Stock.findAll({
    where: {
      cantidad: { [Op.lte]: limite, [Op.gt]: 0 },
    },
    include: [
      { model: Producto, as: 'producto' },
      { model: Sucursal, as: 'sucursal', attributes: ['nombre'] },
    ],
    order: [['cantidad', 'ASC']],
  });
};