import {
  createVentaCompleta,
  findAllVentas,
  findVentaById,
  updateVenta,
  anularVenta,
} from '../../services/index.js';

export const create = async (req, res, next) => {
  try {
    const { venta, detalles } = req.body;
    const ventaCompleta = await createVentaCompleta(venta, detalles);
    res.status(201).json({ success: true, data: ventaCompleta.toJSON() });
  } catch (err) { next(err); }
};

export const list = async (req, res, next) => {
  try {
    const result = await findAllVentas(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};

export const getById = async (req, res, next) => {
  try {
    const venta = await findVentaById(req.params.id);
    res.status(200).json({ success: true, data: venta.toJSON() });
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    const venta = await updateVenta(req.params.id, req.body);
    res.status(200).json({ success: true, data: venta.toJSON() });
  } catch (err) { next(err); }
};

export const anular = async (req, res, next) => {
  try {
    const venta = await anularVenta(req.params.id);
    res.status(200).json({ success: true, data: venta.toJSON() });
  } catch (err) { next(err); }
};