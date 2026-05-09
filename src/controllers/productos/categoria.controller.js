import {
  createCategoria,
  findAllCategorias,
  findCategoriaById,
  updateCategoria,
  removeCategoria,
} from '../../services/index.js';

export const create = async (req, res, next) => {
  try {
    const categoria = await createCategoria(req.body);
    res.status(201).json({ success: true, data: categoria.toJSON() });
  } catch (err) { next(err); }
};

export const list = async (req, res, next) => {
  try {
    const result = await findAllCategorias(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};

export const getById = async (req, res, next) => {
  try {
    const categoria = await findCategoriaById(req.params.id);
    res.status(200).json({ success: true, data: categoria.toJSON() });
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    const categoria = await updateCategoria(req.params.id, req.body);
    res.status(200).json({ success: true, data: categoria.toJSON() });
  } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
  try {
    const categoria = await removeCategoria(req.params.id);
    res.status(200).json({ success: true, data: categoria });
  } catch (err) { next(err); }
};