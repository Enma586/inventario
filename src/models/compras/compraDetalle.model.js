/**
 * @file src/models/compras/compraDetalle.model.js
 * @description Modelo CompraDetalle — línea de orden de compra.
 */

import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const CompraDetalle = sequelize.define(
  'CompraDetalle',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    id_compra: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'compras',
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
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [1], msg: 'La cantidad debe ser al menos 1.' },
      },
    },
    costo_unitario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [0], msg: 'El costo unitario no puede ser negativo.' },
      },
    },
  },
  {
    tableName: 'compra_detalles',
    timestamps: true,
  }
);

CompraDetalle.associate = (models) => {
  CompraDetalle.belongsTo(models.Compra, {
    foreignKey: 'id_compra',
    as: 'compra',
  });
  CompraDetalle.belongsTo(models.Producto, {
    foreignKey: 'id_producto',
    as: 'producto',
  });
};

export default CompraDetalle;