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
    // Llave foránea ahora en Usuario
    id_empleado: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: { name: 'uq_usuario_id_empleado', msg: 'Este empleado ya tiene un usuario asociado.' },
      references: {
        model: 'empleados',
        key: 'id',
      },
    },
    nombre_usuario: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { name: 'uq_usuario_nombre_usuario', msg: 'El nombre de usuario ya está en uso.' },
      validate: {
        notEmpty: { msg: 'El nombre de usuario es obligatorio.' },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { name: 'uq_usuario_email', msg: 'El email ya está registrado.' },
      validate: {
        isEmail: { msg: 'El formato del email no es válido.' },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol: {
      type: DataTypes.ENUM(...ROLES_ARRAY),
      allowNull: false,
      defaultValue: ROLES.EMPLEADO,
    },
    activo: {
      type: DataTypes.BOOLEAN,
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

Usuario.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

// Relación invertida: Usuario pertenece a un Empleado
Usuario.associate = (models) => {
  Usuario.belongsTo(models.Empleado, {
    foreignKey: 'id_empleado',
    as: 'empleado',
  });
};

export default Usuario;