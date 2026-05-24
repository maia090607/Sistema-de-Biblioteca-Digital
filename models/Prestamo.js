const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Prestamo extends Model {}

Prestamo.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha_prestamo: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  fecha_dev_esperada: {
    type: DataTypes.DATE,
    allowNull: false
  },
  fecha_dev_real: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Prestamo',
  tableName: 'prestamos',
  timestamps: true
});

module.exports = Prestamo;