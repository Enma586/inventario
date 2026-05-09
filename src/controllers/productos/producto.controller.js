import {
  createProducto,
  findAllProductos,
  findProductoById,
  updateProducto,
  removeProducto,
} from "../../services/index.js";

export const findAll = async (req, res, next) => {
  try {
    const r = await findAllProductos(req.query);
    res.status(200).json({ success: true, ...r });
  } catch (err) {
    next(err);
  }
};
export const findById = async (req, res, next) => {
  try {
    const r = await findProductoById(req.params.id);
    res.status(200).json({ success: true, data: r.toJSON() });
  } catch (err) {
    next(err);
  }
};
export const create = async (req, res, next) => {
  try {
    const r = await createProducto(req.body);
    res.status(201).json({ success: true, data: r.toJSON() });
  } catch (err) {
    next(err);
  }
};
export const update = async (req, res, next) => {
  try {
    const r = await updateProducto(req.params.id, req.body);
    res.status(200).json({ success: true, data: r.toJSON() });
  } catch (err) {
    next(err);
  }
};
export const remove = async (req, res, next) => {
  try {
    const r = await removeProducto(req.params.id);
    res.status(200).json({ success: true, data: r });
  } catch (err) {
    next(err);
  }
};
