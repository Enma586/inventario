/**
 * @file src/models/ventas/ventaDetalle.model.js
 * @description Modelo VentaDetalle — línea de factura.
 *              nombre_snapshot congela el nombre del producto al momento de la venta
 *              para mantener la inmutabilidad histórica de la factura DTE.
 */

import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const VentaDetalle = sequelize.define(
  'VentaDetalle',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    id_venta: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'ventas',
        key: 'id',
      },
    },
    id_producto: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'productos',
        key: 'id',
      },
    },
    nombre_snapshot: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Nombre del producto congelado al momento de la venta (inmutabilidad DTE).',
      validate: {
        notEmpty: { msg: 'El nombre snapshot es obligatorio.' },
      },
    },
    precio_unitario_venta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [0], msg: 'El precio unitario no puede ser negativo.' },
      },
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [1], msg: 'La cantidad debe ser al menos 1.' },
      },
    },
    subtotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [0], msg: 'El subtotal no puede ser negativo.' },
      },
    },
  },
  {
    tableName: 'venta_detalles',
    timestamps: true,
  }
);

VentaDetalle.associate = (models) => {
  VentaDetalle.belongsTo(models.Venta, {
    foreignKey: 'id_venta',
    as: 'venta',
  });
  VentaDetalle.belongsTo(models.Producto, {
    foreignKey: 'id_producto',
    as: 'producto',
  });
};

export default VentaDetalle;