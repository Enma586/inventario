/**
 * @file src/models/sucursal/stock.model.js
 * @description Modelo Stock — relación muchos-a-muchos entre Producto y Sucursal
 *              con cantidad. Llave primaria compuesta: (id_producto, id_sucursal).
 *              Representa el inventario de un producto en una sucursal específica.
 */

import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Stock = sequelize.define(
  'Stock',
  {
    id_producto: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'productos',
        key: 'id',
      },
    },
    id_sucursal: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'sucursales',
        key: 'id',
      },
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: { args: [0], msg: 'La cantidad no puede ser negativa.' },
      },
    },
  },
  {
    tableName: 'stocks',
    timestamps: true,
    // Sequelize no soporta PK compuesta nativa con `define` + UUID.
    // La restricción UNIQUE(id_producto, id_sucursal) se agrega en la migración.
    indexes: [
      {
        unique: true,
        fields: ['id_producto', 'id_sucursal'],
      },
    ],
  }
);

Stock.associate = (models) => {
  Stock.belongsTo(models.Producto, {
    foreignKey: 'id_producto',
    as: 'producto',
  });
  Stock.belongsTo(models.Sucursal, {
    foreignKey: 'id_sucursal',
    as: 'sucursal',
  });
};

export default Stock;