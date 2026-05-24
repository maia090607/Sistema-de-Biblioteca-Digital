const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Autor extends Model {}

Autor.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  nacionalidad: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Autor',
  tableName: 'autores',
  timestamps: true
});

module.exports = Autor;