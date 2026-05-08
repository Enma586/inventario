/**
 * @file src/models/ventas/venta.model.js
 * @description Modelo Venta — cabecera de factura electrónica (DTE).
 *              Los montos se almacenan en centavos (Integer).
 *              id_empleado registra quién procesó la venta.
 */

import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import {
  METODO_PAGO,
  METODO_PAGO_ARRAY,
  ESTADO_VENTA,
  ESTADO_VENTA_ARRAY,
  ESTADO_DTE,
} from '../../constants/index.js';

const Venta = sequelize.define(
  'Venta',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    numero_factura: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { name: 'uq_venta_numero_factura', msg: 'El número de factura ya existe.' },
      validate: {
        notEmpty: { msg: 'El número de factura es obligatorio.' },
      },
    },
    id_sucursal: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'sucursales',
        key: 'id',
      },
      validate: {
        notNull: { msg: 'La sucursal es obligatoria.' },
      },
    },
    id_empleado: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'empleados',
        key: 'id',
      },
      validate: {
        notNull: { msg: 'El empleado responsable es obligatorio.' },
      },
    },
    cliente_nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El nombre del cliente es obligatorio.' },
      },
    },
    cliente_nit: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El NIT del cliente es obligatorio.' },
      },
    },
    cliente_email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: { msg: 'El email del cliente no tiene un formato válido.' },
      },
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    total_pagado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: { args: [0], msg: 'El total pagado no puede ser negativo.' },
      },
    },
    metodo_pago: {
      type: DataTypes.ENUM(...METODO_PAGO_ARRAY),
      allowNull: false,
      validate: {
        isIn: {
          args: [METODO_PAGO_ARRAY],
          msg: `El método de pago debe ser uno de: ${METODO_PAGO_ARRAY.join(', ')}.`,
        },
      },
    },
    estado: {
      type: DataTypes.ENUM(...ESTADO_VENTA_ARRAY),
      allowNull: false,
      defaultValue: ESTADO_VENTA.PENDIENTE,
      validate: {
        isIn: {
          args: [ESTADO_VENTA_ARRAY],
          msg: `El estado debe ser uno de: ${ESTADO_VENTA_ARRAY.join(', ')}.`,
        },
      },
    },
    estado_dte: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ESTADO_DTE.PENDIENTE,
      validate: {
        notEmpty: { msg: 'El estado DTE es obligatorio.' },
      },
    },
    codigo_generacion: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: { name: 'uq_venta_codigo_generacion', msg: 'El código de generación ya existe.' },
    },
    sello_recepcion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'ventas',
    timestamps: true,
  }
);

// ─── Asociaciones ───
Venta.associate = (models) => {
  Venta.belongsTo(models.Sucursal, {
    foreignKey: 'id_sucursal',
    as: 'sucursal',
  });
  Venta.belongsTo(models.Empleado, {
    foreignKey: 'id_empleado',
    as: 'empleado',
  });
  Venta.hasMany(models.VentaDetalle, {
    foreignKey: 'id_venta',
    as: 'detalles',
  });
};

export default Venta;