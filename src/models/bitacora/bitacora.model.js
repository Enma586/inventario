import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Bitacora = sequelize.define('Bitacora', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  id_usuario: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  accion: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  entidad: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  entidad_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  detalles: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  ip: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  navegador: {
    type: DataTypes.STRING(255),
    allowNull: true,
  }
}, {
  tableName: 'bitacoras',
  timestamps: true,
  updatedAt: false,
});

Bitacora.associate = (models) => {
  Bitacora.belongsTo(models.Usuario, {
    foreignKey: 'id_usuario',
    as: 'usuario',
  });
};

export default Bitacora;