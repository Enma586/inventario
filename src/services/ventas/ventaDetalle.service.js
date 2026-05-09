/**
 * @file src/services/ventas/ventaDetalle.service.js
 * @description Servicio de VentaDetalle — líneas de factura individuales.
 *              Nota: La creación en lote se maneja desde venta.service.js
 *                    (createVentaCompleta). Aquí van operaciones unitarias.
 */

import models from '../../models/index.js';
import { getIO } from '../../config/socket.js';
import { AppError } from '../../utils/AppError.js';

const { VentaDetalle, Venta, Producto } = models;

export const addDetalleVenta = async (data) => {
  const venta = await Venta.findByPk(data.id_venta);
  if (!venta) throw new AppError('Venta no encontrada.', 404);

  if (!data.nombre_snapshot) {
    const producto = await Producto.findByPk(data.id_producto, {
      attributes: ['nombre'],
    });
    data.nombre_snapshot = producto?.nombre || 'Producto';
  }

  data.subtotal = data.cantidad * data.precio_unitario_venta;

  const detalle = await VentaDetalle.create(data);

  // Actualizar total de la venta
  const total = await VentaDetalle.sum('subtotal', {
    where: { id_venta: data.id_venta },
  });
  venta.total_pagado = total;
  await venta.save();

  const io = getIO();
  io.emit('ventaDetalle:created', detalle.toJSON());
  io.emit('venta:updated', { id: venta.id, total_pagado: total });

  return detalle;
};

export const updateDetalleVenta = async (id, data) => {
  const detalle = await VentaDetalle.findByPk(id);
  if (!detalle) throw new AppError('Detalle de venta no encontrado.', 404);

  await detalle.update(data);

  // Recalcular subtotal si cambiaron cantidad o precio
  if (data.cantidad || data.precio_unitario_venta) {
    detalle.subtotal = detalle.cantidad * detalle.precio_unitario_venta;
    await detalle.save();

    // Recalcular total de venta
    const total = await VentaDetalle.sum('subtotal', {
      where: { id_venta: detalle.id_venta },
    });
    await Venta.update(
      { total_pagado: total },
      { where: { id: detalle.id_venta } }
    );
  }

  const io = getIO();
  io.emit('ventaDetalle:updated', detalle.toJSON());

  return detalle;
};

export const removeDetalleVenta = async (id) => {
  const detalle = await VentaDetalle.findByPk(id);
  if (!detalle) throw new AppError('Detalle de venta no encontrado.', 404);

  const id_venta = detalle.id_venta;
  await detalle.destroy();

  // Recalcular total
  const total = await VentaDetalle.sum('subtotal', {
    where: { id_venta },
  });
  await Venta.update({ total_pagado: total || 0 }, { where: { id: id_venta } });

  const io = getIO();
  io.emit('ventaDetalle:deleted', { id, id_venta });

  return detalle.toJSON();
};