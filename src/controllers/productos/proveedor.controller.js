import {
  createProveedor,
  findAllProveedores,
  findProveedorById,
  updateProveedor,
  removeProveedor,
} from "../../services/index.js";

export const findAll = async (req, res, next) => {
  try {
    const r = await findAllProveedores(req.query);
    res.status(200).json({ success: true, ...r });
  } catch (err) {
    next(err);
  }
};
export const findById = async (req, res, next) => {
  try {
    const r = await findProveedorById(req.params.id);
    res.status(200).json({ success: true, data: r.toJSON() });
  } catch (err) {
    next(err);
  }
};
export const create = async (req, res, next) => {
  try {
    const r = await createProveedor(req.body);
    res.locals.createdId = r.id;
    res.status(201).json({ success: true, data: r.toJSON() });
  } catch (err) {
    next(err);
  }
};
export const update = async (req, res, next) => {
  try {
    const r = await updateProveedor(req.params.id, req.body);
    res.status(200).json({ success: true, data: r.toJSON() });
  } catch (err) {
    next(err);
  }
};
export const remove = async (req, res, next) => {
  try {
    const r = await removeProveedor(req.params.id);
    res.status(200).json({ success: true, data: r });
  } catch (err) {
    next(err);
  }
};
