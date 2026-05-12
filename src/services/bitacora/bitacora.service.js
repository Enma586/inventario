import models from '../../models/index.js';
import { sequelizePaginate } from '../helpers.js';

const { Bitacora, Usuario } = models;

export const registrarLog = async (logData, transaction = null) => {
  try {
    await Bitacora.create(logData, { transaction });
  } catch (error) {
    console.error('Error en bitacora:', error.message);
  }
};

export const obtenerBitacora = async (page, limit, filtros = {}) => {
  return sequelizePaginate(Bitacora, {
    page,
    limit,
    where: filtros,
    order: [['createdAt', 'DESC']],
    include: [{
      model: Usuario,
      as: 'usuario',
      attributes: ['nombre_usuario', 'rol']
    }]
  });
};