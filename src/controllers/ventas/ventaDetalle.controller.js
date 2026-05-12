import {
  addDetalleVenta,
  updateDetalleVenta,
  removeDetalleVenta,
} from "../../services/index.js";

export const create = async (req, res, next) => {
  try {
    const r = await addDetalleVenta(req.body);
    res.locals.createdId = r.id;
    res.status(201).json({ success: true, data: r.toJSON() });
  } catch (err) {
    next(err);
  }
};
export const update = async (req, res, next) => {
  try {
    const r = await updateDetalleVenta(req.params.id, req.body);
    res.status(200).json({ success: true, data: r.toJSON() });
  } catch (err) {
    next(err);
  }
};
export const remove = async (req, res, next) => {
  try {
    const r = await removeDetalleVenta(req.params.id);
    res.status(200).json({ success: true, data: r });
  } catch (err) {
    next(err);
  }
};
