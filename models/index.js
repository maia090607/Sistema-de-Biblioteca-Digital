const sequelize = require('../config/database'); // <-- REVISA QUE SOLO ESTÉ ESTA LÍNEA DE CONEXIÓN
const Autor = require('./Autor');
const Libro = require('./Libro');
const Usuario = require('./Usuario');
const Prestamo = require('./Prestamo');

// 1. Relación N:M entre Libro y Autor (Tabla intermedia)
Libro.belongsToMany(Autor, { through: 'libro_autores', foreignKey: 'libro_id', as: 'autores' });
Autor.belongsToMany(Libro, { through: 'libro_autores', foreignKey: 'autor_id', as: 'libros' });

// 2. Relaciones N:1 de Prestamo con Libro y Usuario
Libro.hasMany(Prestamo, { foreignKey: 'libro_id', as: 'prestamos' });
Prestamo.belongsTo(Libro, { foreignKey: 'libro_id', as: 'libro' });

Usuario.hasMany(Prestamo, { foreignKey: 'usuario_id', as: 'prestamos' });
Prestamo.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

module.exports = {
  sequelize,
  Autor,
  Libro,
  Usuario,
  Prestamo
};