import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Distrito = sequelize.define('Distrito', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  id_municipio: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'municipios', key: 'id' },
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'distritos',
  timestamps: false,
});

Distrito.associate = (models) => {
  Distrito.belongsTo(models.Municipio, { foreignKey: 'id_municipio', as: 'municipio' });
};

export default Distrito;