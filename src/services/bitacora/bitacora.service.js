import models from '../../models/index.js';
import { getPagination, getPagingData } from '../../utils/pagination.js';

const { Bitacora, Usuario } = models;

export const registrarLog = async (logData, transaction = null) => {
  try {
    await Bitacora.create(logData, { transaction });
  } catch (error) {
    console.error('Error en bitacora:', error.message);
  }
};

export const obtenerBitacora = async (page, limit, filtros = {}) => {
  const { limit: limitDoc, offset } = getPagination(page, limit);
  
  const data = await Bitacora.findAndCountAll({
    where: filtros,
    limit: limitDoc,
    offset,
    order: [['createdAt', 'DESC']],
    include: [{
      model: Usuario,
      as: 'usuario',
      attributes: ['nombre_usuario', 'rol']
    }]
  });

  return getPagingData(data, page, limitDoc);
};