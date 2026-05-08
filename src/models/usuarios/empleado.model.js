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
    nombres: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellidos: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telefono: { type: DataTypes.STRING },
    direccion: { type: DataTypes.STRING },
  },
  {
    tableName: 'empleados',
    timestamps: true,
  }
);

Empleado.associate = (models) => {
  // Ahora Empleado TIENE un Usuario
  Empleado.hasOne(models.Usuario, {
    foreignKey: 'id_empleado',
    as: 'usuario',
  });

  Empleado.hasMany(models.Venta, {
    foreignKey: 'id_empleado',
    as: 'ventas',
  });
};

export default Empleado;