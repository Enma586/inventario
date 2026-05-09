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

    // 1. Delegamos toda la lógica de negocio y seguridad al Service
    const { usuario, token } = await UserService.loginUsuario(email, password, rememberMe);

    // 2. Calculamos el tiempo de vida de la cookie (Capa HTTP)
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

    res.cookie('token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge,
    });

    // 3. Respondemos al cliente enviando también el token en el JSON 
    //    (esto facilita mucho que Bruno/Postman lo capturen en los tests)
    res.status(200).json({
      success: true,
      token, 
      data: { usuario },
    });
  } catch (err) {
    // Si la contraseña está mal o el usuario no existe, el AppError del Service
    // caerá directamente aquí y tu errorHandler global lo manejará perfectamente.
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