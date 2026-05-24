'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('libro_autores', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      libro_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'libros', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Si se borra el libro, se limpia la relación intermedia
      },
      autor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'autores', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Si se borra el autor, se limpia la relación intermedia
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('libro_autores');
  }
};