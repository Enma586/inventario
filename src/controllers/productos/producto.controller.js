import {
  createProducto,
  findAllProductos,
  findProductoById,
  updateProducto,
  removeProducto,
} from '../../services/index.js';

export const create = async (req, res, next) => {
  try {
    const producto = await createProducto(req.body);
    res.status(201).json({ success: true, data: producto.toJSON() });
  } catch (err) { next(err); }
};

export const list = async (req, res, next) => {
  try {
    const result = await findAllProductos(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};

export const getById = async (req, res, next) => {
  try {
    const producto = await findProductoById(req.params.id);
    res.status(200).json({ success: true, data: producto.toJSON() });
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    const producto = await updateProducto(req.params.id, req.body);
    res.status(200).json({ success: true, data: producto.toJSON() });
  } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
  try {
    const producto = await removeProducto(req.params.id);
    res.status(200).json({ success: true, data: producto });
  } catch (err) { next(err); }
};