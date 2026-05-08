/**
 * @file src/models/sucursal/sucursal.model.js
 * @description Modelo Sucursal — punto de venta o bodega física.
 */

import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Sucursal = sequelize.define(
  'Sucursal',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { name: 'uq_sucursal_nombre', msg: 'El nombre de la sucursal ya existe.' },
      validate: {
        notEmpty: { msg: 'El nombre de la sucursal es obligatorio.' },
      },
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'La dirección es obligatoria.' },
      },
    },
    activa: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'sucursales',
    timestamps: true,
  }
);

Sucursal.associate = (models) => {
  Sucursal.hasMany(models.Stock, {
    foreignKey: 'id_sucursal',
    as: 'stocks',
  });
  Sucursal.hasMany(models.Venta, {
    foreignKey: 'id_sucursal',
    as: 'ventas',
  });
  Sucursal.hasMany(models.Compra, {
    foreignKey: 'id_sucursal',
    as: 'compras',
  });
};

export default Sucursal;