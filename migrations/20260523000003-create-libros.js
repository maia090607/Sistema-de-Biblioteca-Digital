'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('libros', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      titulo: { type: Sequelize.STRING(255), allowNull: false },
      isbn: { type: Sequelize.STRING(20), allowNull: false, unique: true },
      anio_publicacion: { type: Sequelize.INTEGER, allowNull: false },
      copias_disponibles: { type: Sequelize.INTEGER, defaultValue: 0, allowNull: false },
      activo: { type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('libros');
  }
};