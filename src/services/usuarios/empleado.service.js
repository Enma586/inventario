/**
 * @file src/services/usuarios/empleado.service.js
 * @description Servicio de Empleado — perfil laboral asociado a un Usuario.
 */

import { Op } from 'sequelize';
import models from '../../models/index.js';
import { sequelizePaginate } from '../helpers.js';
import { getIO } from '../../config/socket.js';
import { AppError } from '../../utils/AppError.js';

const { Empleado, Usuario } = models;

// ─── Crear perfil ────────────────────────────────────────────────
export const createEmpleado = async (data) => {
  const empleado = await Empleado.create(data);

  const io = getIO();
  io.emit('empleado:created', empleado.toJSON());

  return empleado;
};

// ─── Listar ──────────────────────────────────────────────────────
export const findAllEmpleados = async (query = {}) => {
  const { page, limit, search, sort = 'createdAt', order = 'DESC' } = query;

  const where = {};
  if (search) {
    where[Op.or] = [
      { nombres: { [Op.iLike]: `%${search}%` } },
      { apellidos: { [Op.iLike]: `%${search}%` } },
    ];
  }

  return sequelizePaginate(Empleado, {
    page,
    limit,
    where,
    order: [[sort, order]],
    include: {
      model: Usuario,
      as: 'usuario',
      attributes: ['nombre_usuario', 'email', 'rol', 'activo'],
    },
  });
};

// ─── Buscar por ID ───────────────────────────────────────────────
export const findEmpleadoById = async (id) => {
  const empleado = await Empleado.findByPk(id, {
    include: {
      model: Usuario,
      as: 'usuario',
    },
  });

  if (!empleado) {
    throw new AppError('Empleado no encontrado.', 404);
  }

  return empleado;
};

// ─── Buscar por id_usuario ───────────────────────────────────────
export const findEmpleadoByUsuario = async (id_usuario) => {
  const empleado = await Empleado.findOne({
    where: { id_usuario },
    include: {
      model: Usuario,
      as: 'usuario',
    },
  });

  return empleado;
};

// ─── Actualizar ──────────────────────────────────────────────────
export const updateEmpleado = async (id, data) => {
  const empleado = await Empleado.findByPk(id);
  if (!empleado) {
    throw new AppError('Empleado no encontrado.', 404);
  }

  await empleado.update(data);
  const updated = await Empleado.findByPk(id, {
    include: { model: Usuario, as: 'usuario' },
  });

  const io = getIO();
  io.emit('empleado:updated', updated.toJSON());

  return updated;
};

// ─── Eliminar ────────────────────────────────────────────────────
export const removeEmpleado = async (id) => {
  const empleado = await Empleado.findByPk(id);
  if (!empleado) {
    throw new AppError('Empleado no encontrado.', 404);
  }

  await empleado.destroy();

  const io = getIO();
  io.emit('empleado:deleted', { id });

  return empleado.toJSON();
};