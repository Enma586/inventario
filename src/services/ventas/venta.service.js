/**
 * @file src/services/ventas/venta.service.js
 * @description Servicio de Venta — cabecera de factura DTE.
 *              Genera automáticamente el número de factura según el
 *              formato DTE salvadoreño 2026 (estructura MH).
 *
 * Formato: {COD_SUCURSAL(4)}-{TIPO_DTE(2)}-{CORRELATIVO(10)}
 * Ejemplo:  0001-01-0000000001
 *
 * Donde:
 *   COD_SUCURSAL: código interno de 4 dígitos asignado a la sucursal.
 *   TIPO_DTE: 01=Factura, 03=CCF, 05=Nota Crédito, 06=Nota Débito.
 *   CORRELATIVO: secuencial único por sucursal, zero-padded a 10 dígitos.
 */

import { Op } from 'sequelize';
import models, { sequelize } from '../../models/index.js';
import { sequelizePaginate } from '../helpers.js';
import { getIO } from '../../config/socket.js';
import { AppError } from '../../utils/AppError.js';
import { ESTADO_DTE } from '../../constants/index.js';

const { Venta, VentaDetalle, Sucursal, Empleado, Producto } = models;


// ─── Generar código de sucursal (4 dígitos) ──────────────────────
const getCodigoSucursal = async (id_sucursal) => {
  const sucursal = await Sucursal.findByPk(id_sucursal, {
    attributes: ['id', 'nombre'],
  });
  if (!sucursal) throw new AppError('Sucursal no encontrada.', 404);

  // Usamos los primeros 4 caracteres hex del UUID como código interno
  return sucursal.id.replace(/-/g, '').slice(0, 4).toUpperCase();
};

// ─── Generar número de factura DTE ───────────────────────────────
export const generarNumeroFactura = async (id_sucursal, tipoDte = '01') => {
  const codSucursal = await getCodigoSucursal(id_sucursal);

  // Contar facturas existentes de esta sucursal para el consecutivo
  const count = await Venta.count({
    where: { id_sucursal },
  });

  const correlativo = String(count + 1).padStart(10, '0');

  return `${codSucursal}-${tipoDte}-${correlativo}`;
};

// ─── Crear venta completa (cabecera + detalles en transacción) ───
export const createVentaCompleta = async (ventaData, detalles) => {
  const t = await sequelize.transaction();

  try {
    // 1. Generar número de factura si no viene
    if (!ventaData.numero_factura) {
      ventaData.numero_factura = await generarNumeroFactura(
        ventaData.id_sucursal,
        ventaData.tipo_dte || '01'
      );
    }

    // 2. Crear cabecera
    const venta = await Venta.create(ventaData, { transaction: t });

    // 3. Crear detalles y actualizar stock
    let totalPagado = 0;
    const detallesCreados = [];

    for (const detalle of detalles) {
      detalle.id_venta = venta.id;

      // Congelar nombre del producto (snapshot)
      if (!detalle.nombre_snapshot) {
        const producto = await Producto.findByPk(detalle.id_producto, {
          attributes: ['nombre'],
          transaction: t,
        });
        detalle.nombre_snapshot = producto?.nombre || 'Producto';
      }

      detalle.subtotal = detalle.cantidad * detalle.precio_unitario_venta;
      totalPagado += detalle.subtotal;

      const detalleCreado = await VentaDetalle.create(detalle, { transaction: t });
      detallesCreados.push(detalleCreado);

      // Descontar del stock
      const { Stock } = models;
      const stock = await Stock.findOne({
        where: {
          id_producto: detalle.id_producto,
          id_sucursal: ventaData.id_sucursal,
        },
        transaction: t,
      });

      if (stock) {
        stock.cantidad = Math.max(0, stock.cantidad - detalle.cantidad);
        await stock.save({ transaction: t });
      }
    }

    // 4. Actualizar total de la venta
    venta.total_pagado = totalPagado;
    await venta.save({ transaction: t });

    await t.commit();

    // Recargar venta con relaciones
    const ventaCompleta = await Venta.findByPk(venta.id, {
      include: [
        { model: Sucursal, as: 'sucursal', attributes: ['nombre'] },
        { model: Empleado, as: 'empleado' },
        { model: VentaDetalle, as: 'detalles' },
      ],
    });

    const io = getIO();
    io.emit('venta:created', ventaCompleta.toJSON());
    io.emit('stock:actualizado', { id_sucursal: ventaData.id_sucursal });

    return ventaCompleta;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

// ─── Listar ventas con filtros ───────────────────────────────────
export const findAllVentas = async (query = {}) => {
  const {
    page, limit, sort = 'fecha', order = 'DESC',
    estado, estado_dte, metodo_pago,
    id_sucursal, id_empleado,
    fechaDesde, fechaHasta, search,
  } = query;

  const where = {};
  if (estado) where.estado = estado;
  if (estado_dte) where.estado_dte = estado_dte;
  if (metodo_pago) where.metodo_pago = metodo_pago;
  if (id_sucursal) where.id_sucursal = id_sucursal;
  if (id_empleado) where.id_empleado = id_empleado;

  if (fechaDesde || fechaHasta) {
    where.fecha = {};
    if (fechaDesde) where.fecha[Op.gte] = new Date(fechaDesde);
    if (fechaHasta) where.fecha[Op.lte] = new Date(fechaHasta);
  }

  if (search) {
    where[Op.or] = [
      { numero_factura: { [Op.iLike]: `%${search}%` } },
      { cliente_nombre: { [Op.iLike]: `%${search}%` } },
      { cliente_nit: { [Op.iLike]: `%${search}%` } },
    ];
  }

  return sequelizePaginate(Venta, {
    page,
    limit,
    where,
    order: [[sort, order]],
    include: [
      { model: Sucursal, as: 'sucursal', attributes: ['nombre'] },
      { model: Empleado, as: 'empleado' },
    ],
  });
};

// ─── Buscar por ID ───────────────────────────────────────────────
export const findVentaById = async (id) => {
  const venta = await Venta.findByPk(id, {
    include: [
      { model: Sucursal, as: 'sucursal' },
      { model: Empleado, as: 'empleado' },
      { model: VentaDetalle, as: 'detalles' },
    ],
  });

  if (!venta) throw new AppError('Venta no encontrada.', 404);
  return venta;
};

// ─── Actualizar (campos transaccionales y DTE) ───────────────────
export const updateVenta = async (id, data) => {
  const venta = await Venta.findByPk(id);
  if (!venta) throw new AppError('Venta no encontrada.', 404);

  // No permitir modificar ventas canceladas
  if (venta.estado === 'CANCELADO') {
    throw new AppError('No se puede modificar una venta cancelada.', 400);
  }

  await venta.update(data);

  const io = getIO();
  io.emit('venta:updated', venta.toJSON());

  return venta;
};

// ─── Anular venta (cancelar + restaurar stock) ───────────────────
export const anularVenta = async (id) => {
  const t = await sequelize.transaction();

  try {
    const venta = await Venta.findByPk(id, {
      include: [{ model: VentaDetalle, as: 'detalles' }],
      transaction: t,
    });

    if (!venta) throw new AppError('Venta no encontrada.', 404);
    if (venta.estado === 'CANCELADO') {
      throw new AppError('La venta ya está cancelada.', 400);
    }

    // Restaurar stock
    const { Stock } = models;
    for (const detalle of venta.detalles) {
      const stock = await Stock.findOne({
        where: {
          id_producto: detalle.id_producto,
          id_sucursal: venta.id_sucursal,
        },
        transaction: t,
      });

      if (stock) {
        stock.cantidad += detalle.cantidad;
        await stock.save({ transaction: t });
      }
    }

    venta.estado = 'CANCELADO';
    venta.estado_dte = ESTADO_DTE.ANULADO;
    await venta.save({ transaction: t });

    await t.commit();

    const io = getIO();
    io.emit('venta:cancelada', venta.toJSON());
    io.emit('stock:actualizado', { id_sucursal: venta.id_sucursal });

    return venta;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};