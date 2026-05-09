/**
 * @file src/services/sucursal/sucursal.service.js
 * @description Servicio de Sucursal — CRUD básico con Socket.io.
 */

import { Op } from 'sequelize';
import models from '../../models/index.js';
import { sequelizePaginate } from '../helpers.js';
import { getIO } from '../../config/socket.js';
import { AppError } from '../../utils/AppError.js';

const { Sucursal } = models;

export const createSucursal = async (data) => {
  const sucursal = await Sucursal.create(data);

  const io = getIO();
  io.emit('sucursal:created', sucursal.toJSON());

  return sucursal;
};

export const findAllSucursales = async (query = {}) => {
  const { page, limit, activa, search, sort = 'createdAt', order = 'DESC' } = query;

  const where = {};
  if (activa !== undefined) where.activa = activa;
  if (search) {
    where[Op.or] = [
      { nombre: { [Op.iLike]: `%${search}%` } },
      { direccion: { [Op.iLike]: `%${search}%` } },
    ];
  }

  return sequelizePaginate(Sucursal, {
    page,
    limit,
    where,
    order: [[sort, order]],
  });
};

export const findSucursalById = async (id) => {
  const sucursal = await Sucursal.findByPk(id);
  if (!sucursal) throw new AppError('Sucursal no encontrada.', 404);
  return sucursal;
};

export const updateSucursal = async (id, data) => {
  const sucursal = await Sucursal.findByPk(id);
  if (!sucursal) throw new AppError('Sucursal no encontrada.', 404);

  await sucursal.update(data);

  const io = getIO();
  io.emit('sucursal:updated', sucursal.toJSON());

  return sucursal;
};

export const removeSucursal = async (id) => {
  const sucursal = await Sucursal.findByPk(id);
  if (!sucursal) throw new AppError('Sucursal no encontrada.', 404);

  await sucursal.destroy();

  const io = getIO();
  io.emit('sucursal:deleted', { id });

  return sucursal.toJSON();
};