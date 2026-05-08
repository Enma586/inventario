/**
 * @file src/models/usuarios/usuario.model.js
 * @description Modelo Usuario — entidad de autenticación (login, credenciales).
 *              Hook beforeCreate/beforeUpdate hashea la contraseña con bcrypt.
 *              toJSON() elimina el campo password de cualquier respuesta.
 */

import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../../config/db.js';
import { ROLES, ROLES_ARRAY, BCRYPT_SALT_ROUNDS } from '../../constants/index.js';

const Usuario = sequelize.define(
  'Usuario',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre_usuario: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { name: 'uq_usuario_nombre_usuario', msg: 'El nombre de usuario ya está en uso.' },
      validate: {
        notEmpty: { msg: 'El nombre de usuario es obligatorio.' },
        len: {
          args: [3, 50],
          msg: 'El nombre de usuario debe tener entre 3 y 50 caracteres.',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { name: 'uq_usuario_email', msg: 'El email ya está registrado.' },
      validate: {
        notEmpty: { msg: 'El email es obligatorio.' },
        isEmail: { msg: 'El formato del email no es válido.' },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'La contraseña es obligatoria.' },
        len: {
          args: [6, 128],
          msg: 'La contraseña debe tener al menos 6 caracteres.',
        },
      },
    },
    rol: {
      type: DataTypes.ENUM(...ROLES_ARRAY),
      allowNull: false,
      defaultValue: ROLES.EMPLEADO,
      validate: {
        isIn: {
          args: [ROLES_ARRAY],
          msg: `El rol debe ser uno de: ${ROLES_ARRAY.join(', ')}.`,
        },
      },
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'usuarios',
    timestamps: true,
    hooks: {
      beforeCreate: async (usuario) => {
        usuario.password = await bcrypt.hash(usuario.password, BCRYPT_SALT_ROUNDS);
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed('password')) {
          usuario.password = await bcrypt.hash(usuario.password, BCRYPT_SALT_ROUNDS);
        }
      },
    },
  }
);

// ─── Regla estricta: eliminar password de toda serialización JSON ───
Usuario.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

// ─── Método de instancia: verificar contraseña ───
Usuario.prototype.validarPassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Asociaciones ───
Usuario.associate = (models) => {
  Usuario.hasOne(models.Empleado, {
    foreignKey: 'id_usuario',
    as: 'empleado',
  });
};

export default Usuario;