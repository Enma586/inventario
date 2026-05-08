/**
 * @file src/models/compras/compra.model.js
 * @description Modelo Compra — orden de compra a proveedor.
 *              Los montos se almacenan en centavos (Integer).
 */

import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import { ESTADO_ENTREGA, ESTADO_ENTREGA_ARRAY } from '../../constants/index.js';

const Compra = sequelize.define(
  'Compra',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    numero_orden: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { name: 'uq_compra_numero_orden', msg: 'El número de orden ya existe.' },
      validate: {
        notEmpty: { msg: 'El número de orden es obligatorio.' },
      },
    },
    id_proveedor: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'proveedores',
        key: 'id',
      },
      validate: {
        notNull: { msg: 'El proveedor es obligatorio.' },
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
    total_compra: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: { args: [0], msg: 'El total de compra no puede ser negativo.' },
      },
    },
    estado_entrega: {
      type: DataTypes.ENUM(...ESTADO_ENTREGA_ARRAY),
      allowNull: false,
      defaultValue: ESTADO_ENTREGA.PENDIENTE,
      validate: {
        isIn: {
          args: [ESTADO_ENTREGA_ARRAY],
          msg: `El estado de entrega debe ser uno de: ${ESTADO_ENTREGA_ARRAY.join(', ')}.`,
        },
      },
    },
  },
  {
    tableName: 'compras',
    timestamps: true,
  }
);

Compra.associate = (models) => {
  Compra.belongsTo(models.Proveedor, {
    foreignKey: 'id_proveedor',
    as: 'proveedor',
  });
  Compra.belongsTo(models.Sucursal, {
    foreignKey: 'id_sucursal',
    as: 'sucursal',
  });
  Compra.hasMany(models.CompraDetalle, {
    foreignKey: 'id_compra',
    as: 'detalles',
  });
};

export default Compra;