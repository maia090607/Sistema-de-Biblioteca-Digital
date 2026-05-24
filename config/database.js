const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite', // Usamos SQLite para desarrollo ágil, fácil de cambiar a PostgreSQL/MySQL
  storage: './biblioteca.sqlite',
  logging: false // Cambiar a console.log para auditar las queries generadas
});

module.exports = sequelize;