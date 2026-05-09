/**
 * @file src/services/compras/compra.service.js
 * @description Servicio de Compra — orden de compra a proveedor.
 *              Genera automáticamente el número de orden.
 *
 * Formato: OC-{PROVEEDOR(4)}-{YYYYMMDD}-{CONSECUTIVO(4)}
 * Ejemplo:  OC-A3C4-20260508-0001
 */

import { Op } from 'sequelize';
import models, { sequelize } from '../../models/index.js';
import { sequelizePaginate } from '../helpers.js';
import { getIO } from '../../config/socket.js';
import { AppError } from '../../utils/AppError.js';

const { Compra, CompraDetalle, Proveedor, Sucursal } = models;


// ─── Generar número de orden ─────────────────────────────────────
export const generarNumeroOrden = async (id_proveedor) => {
  const proveedor = await Proveedor.findByPk(id_proveedor, {
    attributes: ['id'],
  });
  if (!proveedor) throw new AppError('Proveedor no encontrado.', 404);

  const prefijo = proveedor.id.replace(/-/g, '').slice(0, 4).toUpperCase();

  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');

  const count = await Compra.count({
    where: {
      id_proveedor,
      createdAt: {
        [Op.gte]: new Date(yyyy, now.getMonth(), now.getDate()),
        [Op.lt]: new Date(yyyy, now.getMonth(), now.getDate() + 1),
      },
    },
  });

  const consecutivo = String(count + 1).padStart(4, '0');

  return `OC-${prefijo}-${yyyy}${mm}${dd}-${consecutivo}`;
};

// ─── Crear compra completa (cabecera + detalles en transacción) ──
export const createCompraCompleta = async (compraData, detalles) => {
  const t = await sequelize.transaction();

  try {
    if (!compraData.numero_orden) {
      compraData.numero_orden = await generarNumeroOrden(compraData.id_proveedor);
    }

    const compra = await Compra.create(compraData, { transaction: t });

    let totalCompra = 0;
    const detallesCreados = [];

    for (const detalle of detalles) {
      detalle.id_compra = compra.id;
      const subtotal = detalle.cantidad * detalle.costo_unitario;
      totalCompra += subtotal;

      const detalleCreado = await CompraDetalle.create(detalle, { transaction: t });
      detallesCreados.push(detalleCreado);
    }

    compra.total_compra = totalCompra;
    await compra.save({ transaction: t });

    await t.commit();

    const compraCompleta = await Compra.findByPk(compra.id, {
      include: [
        { model: Proveedor, as: 'proveedor' },
        { model: Sucursal, as: 'sucursal', attributes: ['nombre'] },
        { model: CompraDetalle, as: 'detalles' },
      ],
    });

    const io = getIO();
    io.emit('compra:created', compraCompleta.toJSON());

    return compraCompleta;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

// ─── Listar compras con filtros ──────────────────────────────────
export const findAllCompras = async (query = {}) => {
  const {
    page, limit, sort = 'createdAt', order = 'DESC',
    estado_entrega, id_proveedor, id_sucursal,
    fechaDesde, fechaHasta, search,
  } = query;

  const where = {};
  if (estado_entrega) where.estado_entrega = estado_entrega;
  if (id_proveedor) where.id_proveedor = id_proveedor;
  if (id_sucursal) where.id_sucursal = id_sucursal;

  if (fechaDesde || fechaHasta) {
    where.createdAt = {};
    if (fechaDesde) where.createdAt[Op.gte] = new Date(fechaDesde);
    if (fechaHasta) where.createdAt[Op.lte] = new Date(fechaHasta);
  }

  if (search) {
    where.numero_orden = { [Op.iLike]: `%${search}%` };
  }

  return sequelizePaginate(Compra, {
    page,
    limit,
    where,
    order: [[sort, order]],
    include: [
      { model: Proveedor, as: 'proveedor' },
      { model: Sucursal, as: 'sucursal', attributes: ['nombre'] },
    ],
  });
};

// ─── Buscar por ID ───────────────────────────────────────────────
export const findCompraById = async (id) => {
  const compra = await Compra.findByPk(id, {
    include: [
      { model: Proveedor, as: 'proveedor' },
      { model: Sucursal, as: 'sucursal' },
      { model: CompraDetalle, as: 'detalles' },
    ],
  });

  if (!compra) throw new AppError('Compra no encontrada.', 404);
  return compra;
};

// ─── Actualizar ──────────────────────────────────────────────────
export const updateCompra = async (id, data) => {
  const compra = await Compra.findByPk(id);
  if (!compra) throw new AppError('Compra no encontrada.', 404);

  if (compra.estado_entrega === 'CANCELADO') {
    throw new AppError('No se puede modificar una compra cancelada.', 400);
  }

  await compra.update(data);

  const io = getIO();
  io.emit('compra:updated', compra.toJSON());

  return compra;
};

// ─── Cancelar compra ─────────────────────────────────────────────
export const cancelarCompra = async (id) => {
  const compra = await Compra.findByPk(id);
  if (!compra) throw new AppError('Compra no encontrada.', 404);
  if (compra.estado_entrega === 'CANCELADO') {
    throw new AppError('La compra ya está cancelada.', 400);
  }

  compra.estado_entrega = 'CANCELADO';
  await compra.save();

  const io = getIO();
  io.emit('compra:cancelada', compra.toJSON());

  return compra;
};