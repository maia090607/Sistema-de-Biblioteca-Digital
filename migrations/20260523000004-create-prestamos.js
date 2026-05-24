'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('prestamos', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      fecha_prestamo: { type: Sequelize.DATE, allowNull: false },
      fecha_dev_esperada: { type: Sequelize.DATE, allowNull: false },
      fecha_dev_real: { type: Sequelize.DATE, allowNull: true },
      libro_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'libros', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT' // Impide borrar un libro si tiene préstamos asociados
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT' // Impide borrar un usuario si tiene préstamos activos
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('prestamos');
  }
};