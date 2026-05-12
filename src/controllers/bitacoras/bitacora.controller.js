import * as bitacoraService from '../../services/index.js';

export const getBitacora = async (req, res, next) => {
  try {
    const { page, limit, accion, entidad } = req.query;
    const filtros = {};
    if (accion) filtros.accion = accion;
    if (entidad) filtros.entidad = entidad;

    const data = await bitacoraService.obtenerBitacora(page, limit, filtros);
    res.status(200).json({ success: true, ...data });
  } catch (error) {
    next(error);
  }
};