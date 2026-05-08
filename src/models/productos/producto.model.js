/**
 * @file src/models/productos/producto.model.js
 * @description Modelo Producto — artículo del inventario.
 *              Los precios se almacenan en centavos (Integer) para evitar
 *              errores de precisión con flotantes.
 */

import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import { ESTADO_PRODUCTO, ESTADO_PRODUCTO_ARRAY } from '../../constants/index.js';

const Producto = sequelize.define(
  'Producto',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { name: 'uq_producto_sku', msg: 'El SKU ya existe.' },
      validate: {
        notEmpty: { msg: 'El SKU es obligatorio.' },
      },
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El nombre del producto es obligatorio.' },
      },
    },
    id_categoria: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'categorias',
        key: 'id',
      },
    },
    id_proveedor: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'proveedores',
        key: 'id',
      },
    },
    estado: {
      type: DataTypes.ENUM(...ESTADO_PRODUCTO_ARRAY),
      allowNull: false,
      defaultValue: ESTADO_PRODUCTO.DISPONIBLE,
      validate: {
        isIn: {
          args: [ESTADO_PRODUCTO_ARRAY],
          msg: `El estado debe ser uno de: ${ESTADO_PRODUCTO_ARRAY.join(', ')}.`,
        },
      },
    },
    costo_compra: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: { args: [0], msg: 'El costo de compra no puede ser negativo.' },
      },
    },
    precio_venta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: { args: [0], msg: 'El precio de venta no puede ser negativo.' },
      },
    },
  },
  {
    tableName: 'productos',
    timestamps: true,
  }
);

Producto.associate = (models) => {
  Producto.belongsTo(models.Categoria, {
    foreignKey: 'id_categoria',
    as: 'categoria',
  });
  Producto.belongsTo(models.Proveedor, {
    foreignKey: 'id_proveedor',
    as: 'proveedor',
  });
  Producto.hasMany(models.Stock, {
    foreignKey: 'id_producto',
    as: 'stocks',
  });
  Producto.hasMany(models.VentaDetalle, {
    foreignKey: 'id_producto',
    as: 'venta_detalles',
  });
  Producto.hasMany(models.CompraDetalle, {
    foreignKey: 'id_producto',
    as: 'compra_detalles',
  });
};

export default Producto;