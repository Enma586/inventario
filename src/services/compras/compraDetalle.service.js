/**
 * @file src/services/compras/compraDetalle.service.js
 * @description Servicio de CompraDetalle — líneas de orden de compra.
 */

import models from '../../models/index.js';
import { getIO } from '../../config/socket.js';
import { AppError } from '../../utils/AppError.js';

const { CompraDetalle, Compra } = models;

// ─── Helper: recalcular total de una compra ──────────────────────
const recalcularTotalCompra = async (id_compra) => {
  const detalles = await CompraDetalle.findAll({
    where: { id_compra },
    attributes: ['cantidad', 'costo_unitario'],
  });

  const total = detalles.reduce(
    (acc, d) => acc + d.cantidad * d.costo_unitario,
    0
  );

  await Compra.update(
    { total_compra: total },
    { where: { id: id_compra } }
  );

  return total;
};

// ─── Agregar detalle ─────────────────────────────────────────────
export const addDetalleCompra = async (data) => {
  const compra = await Compra.findByPk(data.id_compra);
  if (!compra) throw new AppError('Compra no encontrada.', 404);

  const detalle = await CompraDetalle.create(data);

  const total = await recalcularTotalCompra(data.id_compra);

  const io = getIO();
  io.emit('compraDetalle:created', detalle.toJSON());
  io.emit('compra:updated', { id: data.id_compra, total_compra: total });

  return detalle;
};

// ─── Actualizar detalle ──────────────────────────────────────────
export const updateDetalleCompra = async (id, data) => {
  const detalle = await CompraDetalle.findByPk(id);
  if (!detalle) throw new AppError('Detalle de compra no encontrado.', 404);

  await detalle.update(data);

  const total = await recalcularTotalCompra(detalle.id_compra);

  const io = getIO();
  io.emit('compraDetalle:updated', detalle.toJSON());
  io.emit('compra:updated', { id: detalle.id_compra, total_compra: total });

  return detalle;
};

// ─── Eliminar detalle ────────────────────────────────────────────
export const removeDetalleCompra = async (id) => {
  const detalle = await CompraDetalle.findByPk(id);
  if (!detalle) throw new AppError('Detalle de compra no encontrado.', 404);

  const id_compra = detalle.id_compra;
  await detalle.destroy();

  const total = await recalcularTotalCompra(id_compra);

  const io = getIO();
  io.emit('compraDetalle:deleted', { id, id_compra });
  io.emit('compra:updated', { id: id_compra, total_compra: total });

  return detalle.toJSON();
};