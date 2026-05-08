import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Municipio = sequelize.define('Municipio', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  id_departamento: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'departamentos', key: 'id' },
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'municipios',
  timestamps: false,
});

Municipio.associate = (models) => {
  Municipio.belongsTo(models.Departamento, { foreignKey: 'id_departamento', as: 'departamento' });
  Municipio.hasMany(models.Distrito, { foreignKey: 'id_municipio', as: 'distritos' });
};

export default Municipio;