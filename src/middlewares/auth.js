/**
 * @file src/middlewares/auth.js
 * @description Middleware de autenticación JWT vía httpOnly cookie.
 */

import jwt from 'jsonwebtoken';
import models from '../models/index.js';
import { AppError } from '../utils/AppError.js';
import { JWT_SECRET } from '../constants/index.js';

const { Usuario } = models;

export const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new AppError('No se proporcionó token de autenticación.', 401);
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const usuario = await Usuario.findByPk(decoded.id);

    if (!usuario) {
      throw new AppError('Token inválido — usuario no encontrado.', 401);
    }

    if (!usuario.activo) {
      throw new AppError('Tu cuenta ha sido desactivada.', 401);
    }

    req.user = usuario;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return next(new AppError('Token inválido.', 401));
    }
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Token expirado. Inicie sesión nuevamente.', 401));
    }
    next(err);
  }
};