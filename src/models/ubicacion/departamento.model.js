import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Departamento = sequelize.define('Departamento', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  }
}, {
  tableName: 'departamentos',
  timestamps: false,
});

Departamento.associate = (models) => {
  Departamento.hasMany(models.Municipio, { foreignKey: 'id_departamento', as: 'municipios' });
};

export default Departamento;