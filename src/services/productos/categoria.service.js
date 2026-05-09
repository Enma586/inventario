/**
 * @file src/services/productos/categoria.service.js
 * @description Servicio de Categoría — CRUD básico con Socket.io.
 */

import { Op } from 'sequelize';
import models from '../../models/index.js';
import { sequelizePaginate } from '../helpers.js';
import { getIO } from '../../config/socket.js';
import { AppError } from '../../utils/AppError.js';

const { Categoria } = models;

export const createCategoria = async (data) => {
  const categoria = await Categoria.create(data);

  const io = getIO();
  io.emit('categoria:created', categoria.toJSON());

  return categoria;
};

export const findAllCategorias = async (query = {}) => {
  const { page, limit, search, sort = 'createdAt', order = 'DESC' } = query;

  const where = {};
  if (search) {
    where.nombre = { [Op.iLike]: `%${search}%` };
  }

  return sequelizePaginate(Categoria, {
    page,
    limit,
    where,
    order: [[sort, order]],
  });
};

export const findCategoriaById = async (id) => {
  const categoria = await Categoria.findByPk(id);
  if (!categoria) throw new AppError('Categoría no encontrada.', 404);
  return categoria;
};

export const updateCategoria = async (id, data) => {
  const categoria = await Categoria.findByPk(id);
  if (!categoria) throw new AppError('Categoría no encontrada.', 404);

  await categoria.update(data);

  const io = getIO();
  io.emit('categoria:updated', categoria.toJSON());

  return categoria;
};

export const removeCategoria = async (id) => {
  const categoria = await Categoria.findByPk(id);
  if (!categoria) throw new AppError('Categoría no encontrada.', 404);

  await categoria.destroy();

  const io = getIO();
  io.emit('categoria:deleted', { id });

  return categoria.toJSON();
};