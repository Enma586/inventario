/**
 * @file src/services/productos/proveedor.service.js
 * @description Servicio de Proveedor — CRUD básico con Socket.io.
 */

import { Op } from 'sequelize';
import models from '../../models/index.js';
import { sequelizePaginate } from '../helpers.js';
import { getIO } from '../../config/socket.js';
import { AppError } from '../../utils/AppError.js';

const { Proveedor } = models;

export const createProveedor = async (data) => {
  const proveedor = await Proveedor.create(data);

  const io = getIO();
  io.emit('proveedor:created', proveedor.toJSON());

  return proveedor;
};

export const findAllProveedores = async (query = {}) => {
  const { page, limit, search, sort = 'createdAt', order = 'DESC' } = query;

  const where = {};
  if (search) {
    where.nombre = { [Op.iLike]: `%${search}%` };
  }

  return sequelizePaginate(Proveedor, {
    page,
    limit,
    where,
    order: [[sort, order]],
  });
};

export const findProveedorById = async (id) => {
  const proveedor = await Proveedor.findByPk(id);
  if (!proveedor) throw new AppError('Proveedor no encontrado.', 404);
  return proveedor;
};

export const updateProveedor = async (id, data) => {
  const proveedor = await Proveedor.findByPk(id);
  if (!proveedor) throw new AppError('Proveedor no encontrado.', 404);

  await proveedor.update(data);

  const io = getIO();
  io.emit('proveedor:updated', proveedor.toJSON());

  return proveedor;
};

export const removeProveedor = async (id) => {
  const proveedor = await Proveedor.findByPk(id);
  if (!proveedor) throw new AppError('Proveedor no encontrado.', 404);

  await proveedor.destroy();

  const io = getIO();
  io.emit('proveedor:deleted', { id });

  return proveedor.toJSON();
};