/**
 * @file src/services/helpers.js
 * @description Helpers compartidos por todos los servicios:
 *              - sequelizePaginate: paginación estándar con findAndCountAll.
 */

import { getPagination, getPagingData } from '../utils/pagination.js';

/**
 * Wrapper de paginación para Sequelize.
 * @param {Model} Model       - Modelo Sequelize
 * @param {object} options    - Opciones de findAndCountAll (where, include, order, etc.)
 * @param {number} options.page
 * @param {number} options.limit
 * @returns {{ data: Array, pagination: object }}
 */
export const sequelizePaginate = async (Model, options = {}) => {
  const { page = 1, limit = 10, ...queryOptions } = options;

  const { skip, limit: safeLimit } = getPagination(page, limit);

  const { count, rows } = await Model.findAndCountAll({
    ...queryOptions,
    offset: skip,
    limit: safeLimit,
  });

  return {
    data: rows,
    pagination: getPagingData(count, page, safeLimit),
  };
};