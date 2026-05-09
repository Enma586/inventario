/**
 * @file src/services/compras/compraDetalle.service.js
 * @description Servicio de CompraDetalle — líneas de orden de compra.
 */

import models from '../../models/index.js';
import { getIO } from '../../config/socket.js';
import { AppError } from '../../utils/AppError.js';

const { CompraDetalle, Compra } = models;

export const addDetalleCompra = async (data) => {
  const compra = await Compra.findByPk(data.id_compra);
  if (!compra) throw new AppError('Compra no encontrada.', 404);

  const detalle = await CompraDetalle.create(data);

  // Recalcular total
  const total = await CompraDetalle.sum('costo_unitario', {
    where: { id_compra: data.id_compra },
  });
  compra.total_compra = total;
  await compra.save();

  const io = getIO();
  io.emit('compraDetalle:created', detalle.toJSON());

  return detalle;
};

export const updateDetalleCompra = async (id, data) => {
  const detalle = await CompraDetalle.findByPk(id);
  if (!detalle) throw new AppError('Detalle de compra no encontrado.', 404);

  await detalle.update(data);

  // Recalcular total de la compra
  const total = await CompraDetalle.sum('costo_unitario', {
    where: { id_compra: detalle.id_compra },
  });
  await Compra.update(
    { total_compra: total || 0 },
    { where: { id: detalle.id_compra } }
  );

  const io = getIO();
  io.emit('compraDetalle:updated', detalle.toJSON());

  return detalle;
};

export const removeDetalleCompra = async (id) => {
  const detalle = await CompraDetalle.findByPk(id);
  if (!detalle) throw new AppError('Detalle de compra no encontrado.', 404);

  const id_compra = detalle.id_compra;
  await detalle.destroy();

  // Recalcular total
  const total = await CompraDetalle.sum('costo_unitario', {
    where: { id_compra },
  });
  await Compra.update({ total_compra: total || 0 }, { where: { id: id_compra } });

  const io = getIO();
  io.emit('compraDetalle:deleted', { id, id_compra });

  return detalle.toJSON();
};