import {
  createCompraCompleta,
  findAllCompras,
  findCompraById,
  updateCompra,
  cancelarCompra,
} from '../../services/index.js';

export const create = async (req, res, next) => {
  try {
    const { compra, detalles } = req.body;
    const compraCompleta = await createCompraCompleta(compra, detalles);
    res.status(201).json({ success: true, data: compraCompleta.toJSON() });
  } catch (err) { next(err); }
};

export const list = async (req, res, next) => {
  try {
    const result = await findAllCompras(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};

export const getById = async (req, res, next) => {
  try {
    const compra = await findCompraById(req.params.id);
    res.status(200).json({ success: true, data: compra.toJSON() });
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    const compra = await updateCompra(req.params.id, req.body);
    res.status(200).json({ success: true, data: compra.toJSON() });
  } catch (err) { next(err); }
};

export const cancelar = async (req, res, next) => {
  try {
    const compra = await cancelarCompra(req.params.id);
    res.status(200).json({ success: true, data: compra.toJSON() });
  } catch (err) { next(err); }
};