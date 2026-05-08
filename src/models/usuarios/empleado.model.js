/**
 * @file src/models/usuarios/empleado.model.js
 * @description Modelo Empleado — perfil laboral asociado a un Usuario.
 *              Relación 1:1 con Usuario (cada empleado tiene una cuenta de login).
 *              Se asocia directamente a Venta como responsable de la transacción.
 */

import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Empleado = sequelize.define(
  'Empleado',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    id_usuario: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: { name: 'uq_empleado_id_usuario', msg: 'Este usuario ya tiene un perfil de empleado asociado.' },
      references: {
        model: 'usuarios',
        key: 'id',
      },
    },
    nombres: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El nombre del empleado es obligatorio.' },
      },
    },
    apellidos: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Los apellidos del empleado son obligatorios.' },
      },
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'empleados',
    timestamps: true,
  }
);

// ─── Asociaciones ───
Empleado.associate = (models) => {
  // 1:1 con Usuario
  Empleado.belongsTo(models.Usuario, {
    foreignKey: 'id_usuario',
    as: 'usuario',
  });

  // Un empleado puede ser responsable de muchas ventas
  Empleado.hasMany(models.Venta, {
    foreignKey: 'id_empleado',
    as: 'ventas',
  });
};

export default Empleado;