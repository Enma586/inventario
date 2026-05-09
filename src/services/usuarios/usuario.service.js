/**
 * @file src/services/usuarios/usuario.service.js
 * @description Servicio de Usuario — autenticación, CRUD, registro con Empleado.
 *              Adaptado de Mongoose a Sequelize + PostgreSQL.
 *              Integra Socket.io para eventos en tiempo real.
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import models, { sequelize } from '../../models/index.js';
import { sequelizePaginate } from '../helpers.js';
import { getIO } from '../../config/socket.js';
import { AppError } from '../../utils/AppError.js';
import {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  BCRYPT_SALT_ROUNDS,
    JWT_REMEMBER_EXPIRES_IN,
} from '../../constants/index.js';

const { Usuario, Empleado } = models;

// ─── Crear usuario (solo cuenta) ─────────────────────────────────
export const createUsuario = async (data) => {
  const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
  data.password = await bcrypt.hash(data.password, salt);

  const usuario = await Usuario.create(data);

  const io = getIO();
  io.emit('usuario:created', usuario.toJSON());

  return usuario;
};

// ─── Registro completo (Usuario + Empleado en transacción) ──────
export const registerUsuarioEmpleado = async ({ usuario: userData, empleado: empData }) => {
  const transaction = await sequelize.transaction();

  try {
    const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
    const password = await bcrypt.hash(userData.password, salt);

    const usuario = await Usuario.create(
      { ...userData, password },
      { transaction }
    );

    const empleado = await Empleado.create(
      { ...empData, id_usuario: usuario.id },
      { transaction }
    );

    await transaction.commit();

    const token = jwt.sign({ id: usuario.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    const io = getIO();
    io.emit('usuario:registered', usuario.toJSON());

    return {
      usuario: usuario.toJSON(),
      empleado: empleado.toJSON(),
      token,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// ─── Login ───────────────────────────────────────────────────────
// ─── Login ───────────────────────────────────────────────────────
export const loginUsuario = async (email, password, rememberMe = false) => {
  const usuario = await Usuario.findOne({
    where: { email },
  });

  if (!usuario) {
    throw new AppError('Credenciales inválidas.', 401);
  }

  const isValid = await usuario.validarPassword(password);
  if (!isValid) {
    throw new AppError('Credenciales inválidas.', 401);
  }

  if (!usuario.activo) {
    throw new AppError('La cuenta está desactivada. Contacte al administrador.', 403);
  }

  const expiresIn = rememberMe ? JWT_REMEMBER_EXPIRES_IN : JWT_EXPIRES_IN;

  const token = jwt.sign({ id: usuario.id }, JWT_SECRET, { expiresIn });

  return {
    usuario: usuario.toJSON(),
    token,
  };
};

// ─── Renovar token (para /renew) ─────────────────────────────────
export const renewToken = async (usuarioId) => {
  const usuario = await Usuario.findByPk(usuarioId, {
    include: {
      model: Empleado,
      as: 'empleado',
    },
  });

  if (!usuario || !usuario.activo) {
    throw new AppError('Usuario no encontrado o inactivo.', 404);
  }

  const token = jwt.sign({ id: usuario.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    usuario: usuario.toJSON(),
    token,
  };
};

// ─── Listar con paginación y filtros ─────────────────────────────
export const findAllUsuarios = async (query = {}) => {
  const { page, limit, rol, activo, search, sort = 'createdAt', order = 'DESC' } = query;

  const where = {};
  if (rol) where.rol = rol;
  if (activo !== undefined) where.activo = activo;
  if (search) {
    where[Op.or] = [
      { nombre_usuario: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }

  return sequelizePaginate(Usuario, {
    page,
    limit,
    where,
    order: [[sort, order]],
    include: {
      model: Empleado,
      as: 'empleado',
    },
  });
};

// ─── Buscar por ID ───────────────────────────────────────────────
export const findUsuarioById = async (id) => {
  const usuario = await Usuario.findByPk(id, {
    include: {
      model: Empleado,
      as: 'empleado',
    },
  });

  if (!usuario) {
    throw new AppError('Usuario no encontrado.', 404);
  }

  return usuario;
};

// ─── Buscar por email (para login interno) ───────────────────────
export const findUsuarioByEmail = async (email) => {
  return Usuario.findOne({
    where: { email },
    include: {
      model: Empleado,
      as: 'empleado',
    },
  });
};

// ─── Actualizar ──────────────────────────────────────────────────
export const updateUsuario = async (id, data) => {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) {
    throw new AppError('Usuario no encontrado.', 404);
  }

  if (data.password) {
    const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
    data.password = await bcrypt.hash(data.password, salt);
  }

  await usuario.update(data, { individualHooks: true });
  const updated = await Usuario.findByPk(id, {
    include: { model: Empleado, as: 'empleado' },
  });

  const io = getIO();
  io.emit('usuario:updated', updated.toJSON());

  return updated;
};

// ─── Eliminar ────────────────────────────────────────────────────
export const removeUsuario = async (id) => {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) {
    throw new AppError('Usuario no encontrado.', 404);
  }

  await usuario.destroy();

  const io = getIO();
  io.emit('usuario:deleted', { id });

  return usuario.toJSON();
};