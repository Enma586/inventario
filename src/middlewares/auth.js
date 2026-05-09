/**
 * @file src/middlewares/auth.js
 * @description Middleware de autenticación JWT.
 *              Extrae token del header Authorization: Bearer <token>.
 *              Verifica firma, busca usuario en BD, y lo adjunta a req.user.
 */

import jwt from 'jsonwebtoken';
import models from '../models/index.js';
import { AppError } from '../utils/AppError.js';
import { JWT_SECRET, AUTH_HEADER, TOKEN_PREFIX } from '../constants/index.js';

const { Usuario } = models;

export const auth = async (req, res, next) => {
  try {
    // 1. Extraer token del header
    const authHeader = req.headers[AUTH_HEADER];
    if (!authHeader || !authHeader.startsWith(TOKEN_PREFIX)) {
      throw new AppError('Token de autenticación no proporcionado.', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AppError('Token de autenticación no proporcionado.', 401);
    }

    // 2. Verificar firma JWT
    const decoded = jwt.verify(token, JWT_SECRET);

    // 3. Buscar usuario en BD
    const usuario = await Usuario.findByPk(decoded.id);

    if (!usuario) {
      throw new AppError('Token inválido — usuario no encontrado.', 401);
    }

    if (!usuario.activo) {
      throw new AppError('Tu cuenta ha sido desactivada. Contacte al administrador.', 401);
    }

    // 4. Adjuntar al request
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