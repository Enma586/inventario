import {
  addDetalleCompra,
  updateDetalleCompra,
  removeDetalleCompra,
} from '../../services/index.js';

export const add = async (req, res, next) => {
  try {
    const detalle = await addDetalleCompra(req.body);
    res.status(201).json({ success: true, data: detalle.toJSON() });
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    const detalle = await updateDetalleCompra(req.params.id, req.body);
    res.status(200).json({ success: true, data: detalle.toJSON() });
  } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
  try {
    const detalle = await removeDetalleCompra(req.params.id);
    res.status(200).json({ success: true, data: detalle });
  } catch (err) { next(err); }
};