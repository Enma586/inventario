import {
  createCategoria,
  findAllCategorias,
  findCategoriaById,
  updateCategoria,
  removeCategoria,
} from "../../services/index.js";

export const findAll = async (req, res, next) => {
  try {
    const r = await findAllCategorias(req.query);
    res.status(200).json({ success: true, ...r });
  } catch (err) {
    next(err);
  }
};
export const findById = async (req, res, next) => {
  try {
    const r = await findCategoriaById(req.params.id);
    res.status(200).json({ success: true, data: r.toJSON() });
  } catch (err) {
    next(err);
  }
};
export const create = async (req, res, next) => {
  try {
    const r = await createCategoria(req.body);
    res.status(201).json({ success: true, data: r.toJSON() });
  } catch (err) {
    next(err);
  }
};
export const update = async (req, res, next) => {
  try {
    const r = await updateCategoria(req.params.id, req.body);
    res.status(200).json({ success: true, data: r.toJSON() });
  } catch (err) {
    next(err);
  }
};
export const remove = async (req, res, next) => {
  try {
    const r = await removeCategoria(req.params.id);
    res.status(200).json({ success: true, data: r });
  } catch (err) {
    next(err);
  }
};
