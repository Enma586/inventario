import {
  upsertStock,
  findAllStocks,
  findStockByProductoAndSucursal,
  updateStockCantidad,
  removeStock,
  getStockBajo,
} from "../../services/index.js";

export const findAll = async (req, res, next) => {
  try {
    const r = await findAllStocks(req.query);
    res.status(200).json({ success: true, ...r });
  } catch (err) {
    next(err);
  }
};
export const findByProductoSucursal = async (req, res, next) => {
  try {
    const stock = await findStockByProductoAndSucursal(
      req.params.id_producto,
      req.params.id_sucursal,
    );
    if (!stock)
      return res
        .status(404)
        .json({ success: false, message: "Stock no encontrado." });
    res.status(200).json({ success: true, data: stock.toJSON() });
  } catch (err) {
    next(err);
  }
};
export const upsert = async (req, res, next) => {
  try {
     const r = await upsertStock(req.body);
     if (r.created) res.locals.createdId = r.id_producto;
    res.status(r.created ? 201 : 200).json({ success: true, data: r });
  } catch (err) {
    next(err);
  }
};
export const updateCantidad = async (req, res, next) => {
  try {
    const stock = await updateStockCantidad(
      req.params.id_producto,
      req.params.id_sucursal,
      req.body.cantidad,
    );
    res.status(200).json({ success: true, data: stock.toJSON() });
  } catch (err) {
    next(err);
  }
};
export const remove = async (req, res, next) => {
  try {
    const r = await removeStock(req.params.id_producto, req.params.id_sucursal);
    res.status(200).json({ success: true, data: r });
  } catch (err) {
    next(err);
  }
};
export const bajo = async (req, res, next) => {
  try {
    const limite = parseInt(req.query.limite, 10) || 5;
    const r = await getStockBajo(limite);
    res.status(200).json({ success: true, data: r });
  } catch (err) {
    next(err);
  }
};
