import {
  createCompraCompleta,
  findAllCompras,
  findCompraById,
  updateCompra,
  cancelarCompra,
} from "../../services/index.js";

export const findAll = async (req, res, next) => {
  try {
    const r = await findAllCompras(req.query);
    res.status(200).json({ success: true, ...r });
  } catch (err) {
    next(err);
  }
};
export const findById = async (req, res, next) => {
  try {
    const r = await findCompraById(req.params.id);
    res.status(200).json({ success: true, data: r.toJSON() });
  } catch (err) {
    next(err);
  }
};
export const create = async (req, res, next) => {
  try {
    const { compra, detalles } = req.body;
    const r = await createCompraCompleta(compra, detalles);
    res.status(201).json({ success: true, data: r.toJSON() });
  } catch (err) {
    next(err);
  }
};
export const update = async (req, res, next) => {
  try {
    const r = await updateCompra(req.params.id, req.body);
    res.status(200).json({ success: true, data: r.toJSON() });
  } catch (err) {
    next(err);
  }
};
export const cancelar = async (req, res, next) => {
  try {
    const r = await cancelarCompra(req.params.id);
    res.status(200).json({ success: true, data: r.toJSON() });
  } catch (err) {
    next(err);
  }
};
