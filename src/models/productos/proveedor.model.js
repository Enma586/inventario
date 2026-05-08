/**
 * @file src/models/productos/proveedor.model.js
 * @description Modelo Proveedor — entidad que suministra productos.
 */

import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Proveedor = sequelize.define(
  'Proveedor',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El nombre del proveedor es obligatorio.' },
      },
    },
    contacto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'proveedores',
    timestamps: true,
  }
);

Proveedor.associate = (models) => {
  Proveedor.hasMany(models.Producto, {
    foreignKey: 'id_proveedor',
    as: 'productos',
  });
  Proveedor.hasMany(models.Compra, {
    foreignKey: 'id_proveedor',
    as: 'compras',
  });
};

export default Proveedor;