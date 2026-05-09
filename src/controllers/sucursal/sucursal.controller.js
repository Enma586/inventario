import {
  createSucursal,
  findAllSucursales,
  findSucursalById,
  updateSucursal,
  removeSucursal,
} from '../../services/index.js';

export const create = async (req, res, next) => {
  try {
    const sucursal = await createSucursal(req.body);
    res.status(201).json({ success: true, data: sucursal.toJSON() });
  } catch (err) { next(err); }
};

export const list = async (req, res, next) => {
  try {
    const result = await findAllSucursales(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};

export const getById = async (req, res, next) => {
  try {
    const sucursal = await findSucursalById(req.params.id);
    res.status(200).json({ success: true, data: sucursal.toJSON() });
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    const sucursal = await updateSucursal(req.params.id, req.body);
    res.status(200).json({ success: true, data: sucursal.toJSON() });
  } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
  try {
    const sucursal = await removeSucursal(req.params.id);
    res.status(200).json({ success: true, data: sucursal });
  } catch (err) { next(err); }
};