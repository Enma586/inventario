import {
  createVentaCompleta,
  findAllVentas,
  findVentaById,
  updateVenta,
  anularVenta,
} from "../../services/index.js";

export const findAll = async (req, res, next) => {
  try {
    const r = await findAllVentas(req.query);
    res.status(200).json({ success: true, ...r });
  } catch (err) {
    next(err);
  }
};
export const findById = async (req, res, next) => {
  try {
    const r = await findVentaById(req.params.id);
    res.status(200).json({ success: true, data: r.toJSON() });
  } catch (err) {
    next(err);
  }
};
export const create = async (req, res, next) => {
  try {
    const { venta, detalles } = req.body;
    const r = await createVentaCompleta(venta, detalles);
    res.locals.createdId = r.id;
    res.status(201).json({ success: true, data: r.toJSON() });
  } catch (err) {
    next(err);
  }
};
export const update = async (req, res, next) => {
  try {
    const r = await updateVenta(req.params.id, req.body);
    res.status(200).json({ success: true, data: r.toJSON() });
  } catch (err) {
    next(err);
  }
};
export const anular = async (req, res, next) => {
  try {
    const r = await anularVenta(req.params.id);
    res.status(200).json({ success: true, data: r.toJSON() });
  } catch (err) {
    next(err);
  }
};
