import {
  createProveedor,
  findAllProveedores,
  findProveedorById,
  updateProveedor,
  removeProveedor,
} from '../../services/index.js';

export const create = async (req, res, next) => {
  try {
    const proveedor = await createProveedor(req.body);
    res.status(201).json({ success: true, data: proveedor.toJSON() });
  } catch (err) { next(err); }
};

export const list = async (req, res, next) => {
  try {
    const result = await findAllProveedores(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};

export const getById = async (req, res, next) => {
  try {
    const proveedor = await findProveedorById(req.params.id);
    res.status(200).json({ success: true, data: proveedor.toJSON() });
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    const proveedor = await updateProveedor(req.params.id, req.body);
    res.status(200).json({ success: true, data: proveedor.toJSON() });
  } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
  try {
    const proveedor = await removeProveedor(req.params.id);
    res.status(200).json({ success: true, data: proveedor });
  } catch (err) { next(err); }
};