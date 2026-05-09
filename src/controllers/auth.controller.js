/**
 * @file src/controllers/auth.controller.js
 * @description Controlador de autenticación — solo manejo de sesión.
 *              Cookies httpOnly. Sin CRUD de usuarios.
 */

import jwt from 'jsonwebtoken';
import models from '../models/index.js';
import * as UserService from '../services/index.js';
import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';
import {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  JWT_REMEMBER_EXPIRES_IN,
} from '../constants/index.js';

const { Usuario } = models;

// ─── POST /api/auth/login ────────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    const usuario = await UserService.findUsuarioByEmail(email);

    if (!usuario || !(await usuario.validarPassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: 'Credenciales inválidas' });
    }

    if (!usuario.activo) {
      return res
        .status(403)
        .json({ success: false, message: 'Cuenta de usuario desactivada' });
    }

    const expiresIn = rememberMe ? JWT_REMEMBER_EXPIRES_IN : JWT_EXPIRES_IN;
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

    const token = jwt.sign({ id: usuario.id }, JWT_SECRET, { expiresIn });

    res.cookie('token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge,
    });

    res.status(200).json({
      success: true,
      data: { usuario: usuario.toJSON() },
    });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/auth/register ─────────────────────────────────────
export const register = async (req, res, next) => {
  try {
    const { usuario, empleado, token } =
      await UserService.registerUsuarioEmpleado(req.body);

    res.cookie('token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: 'Cuenta creada exitosamente.',
      data: {
        usuario,
        empleado: {
          id: empleado.id,
          nombres: empleado.nombres,
          apellidos: empleado.apellidos,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/auth/logout ───────────────────────────────────────
export const logout = (req, res) => {
  res.clearCookie('token');
  res
    .status(200)
    .json({ success: true, message: 'Sesión cerrada exitosamente' });
};

// ─── GET /api/auth/me ────────────────────────────────────────────
export const me = async (req, res) => {
  res.status(200).json({ success: true, data: req.user.toJSON() });
};

// ─── GET /api/auth/verify ────────────────────────────────────────
export const verifyToken = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: req.user.toJSON() });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/auth/renew ─────────────────────────────────────────
export const renew = async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id);

    if (!usuario || !usuario.activo) {
      return res
        .status(404)
        .json({ success: false, message: 'Usuario no encontrado o inactivo' });
    }

    const token = jwt.sign({ id: usuario.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      data: { usuario: usuario.toJSON() },
    });
  } catch (err) {
    next(err);
  }
};