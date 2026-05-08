/**
 * @file src/models/productos/categoria.model.js
 * @description Modelo Categoria — agrupación de productos.
 */

import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Categoria = sequelize.define(
  'Categoria',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { name: 'uq_categoria_nombre', msg: 'La categoría ya existe.' },
      validate: {
        notEmpty: { msg: 'El nombre de la categoría es obligatorio.' },
      },
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'categorias',
    timestamps: true,
  }
);

Categoria.associate = (models) => {
  Categoria.hasMany(models.Producto, {
    foreignKey: 'id_categoria',
    as: 'productos',
  });
};

export default Categoria;