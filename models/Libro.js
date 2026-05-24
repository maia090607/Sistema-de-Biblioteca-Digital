const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Libro extends Model {}

Libro.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  isbn: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true // Requerimiento R1 y R6
  },
  anio_publicacion: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  copias_disponibles: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0 // Requerimiento R6: No puede ser negativo
    }
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'Libro',
  tableName: 'libros',
  timestamps: true
});

module.exports = Libro;