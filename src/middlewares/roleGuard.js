/**
 * @file src/middlewares/roleGuard.js
 * @description Middleware de autorización por roles.
 *              Usa req.user.rol (Sequelize) en vez de req.user.role.
 */

import { AppError } from '../utils/AppError.js';

export const roleGuard = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('No autenticado.', 401));
    }

    if (!allowedRoles.includes(req.user.rol)) {
      return next(new AppError('No tienes permisos para realizar esta acción.', 403));
    }

    next();
  };
};