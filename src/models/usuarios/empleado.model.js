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
    dui: { 
      type: DataTypes.STRING(10),
      unique: { name: 'uq_empleado_dui', msg: 'Este DUI ya está registrado en el sistema.' },
      allowNull: false, 
    },
  },
  {
    tableName: 'empleados',
    timestamps: true,
  }
);

Empleado.associate = (models) => {
  // Se mantiene la relación con Usuario porque es necesaria para el acceso
  Empleado.hasOne(models.Usuario, {
    foreignKey: 'id_empleado',
    as: 'usuario',
  });

  // Se mantiene para el registro de operaciones
  Empleado.hasMany(models.Venta, {
    foreignKey: 'id_empleado',
    as: 'ventas',
  });
};

export default Empleado;