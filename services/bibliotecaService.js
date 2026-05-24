const { Op } = require('sequelize');
const { sequelize, Libro, Autor, Usuario, Prestamo } = require('../models');

class BibliotecaService {
  
  // 1. Registrar un libro con sus autores
  async registrarLibroConAutores(datosLibro, autoresIds) {
    const t = await sequelize.transaction();
    try {
      const nuevoLibro = await Libro.create(datosLibro, { transaction: t });
      
      if (autoresIds && autoresIds.length > 0) {
        await nuevoLibro.addAutores(autoresIds, { transaction: t });
      }
      
      await t.commit();
      return nuevoLibro;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  // 2. Listar libros activos con sus autores (Evitando el problema N+1 usando Eager Loading)
  async listarLibrosActivos() {
    return await Libro.findAll({
      where: { activo: true },
      include: [{
        model: Autor,
        as: 'autores',
        through: { attributes: [] } // Oculta los datos crudos de la tabla intermedia en el JSON
      }]
    });
  }

  // 3. Registrar un préstamo (Con decremento de stock y transacción atómica)
  async registrarPrestamo(usuario_id, libro_id, diasPrestamo = 7) {
    const t = await sequelize.transaction();
    try {
      const libro = await Libro.findByPk(libro_id, { transaction: t });
      if (!libro) throw new Error('El libro solicitado no existe.');
      
      // Validación R6: No se puede prestar un libro con copias_disponibles = 0
      if (libro.copias_disponibles <= 0) {
        throw new Error(`Operación rechazada: El libro "${libro.titulo}" no cuenta con copias disponibles.`);
      }

      const usuario = await Usuario.findByPk(usuario_id, { transaction: t });
      if (!usuario) throw new Error('El usuario no existe.');

      const fecha_prestamo = new Date();
      const fecha_dev_esperada = new Date();
      fecha_dev_esperada.setDate(fecha_prestamo.getDate() + diasPrestamo);

      // Crear registro de préstamo
      const prestamo = await Prestamo.create({
        usuario_id,
        libro_id,
        fecha_prestamo,
        fecha_dev_esperada
      }, { transaction: t });

      // Descontar stock (Usa decrement nativo para evitar race conditions)
      await libro.decrement('copias_disponibles', { by: 1, transaction: t });

      await t.commit();
      return prestamo;
    } catch (error) {
      await t.rollback(); // Rollback automático si falla la actualización o validación (R5)
      throw error;
    }
  }

  // 4. Registrar la devolución (Con restablecimiento de stock)
  async registrarDevolucion(prestamo_id) {
    const t = await sequelize.transaction();
    try {
      const prestamo = await Prestamo.findByPk(prestamo_id, { transaction: t });
      if (!prestamo) throw new Error('El registro de préstamo no existe.');
      if (prestamo.fecha_dev_real) throw new Error('Este préstamo ya fue devuelto con anterioridad.');

      // Marcar fecha real de devolución
      prestamo.fecha_dev_real = new Date();
      await prestamo.save({ transaction: t });

      // Restablecer copia al inventario
      const libro = await Libro.findByPk(prestamo.libro_id, { transaction: t });
      await libro.increment('copias_disponibles', { by: 1, transaction: t });

      await t.commit();
      return prestamo;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  // 5. Consultar préstamos activos (sin fecha de devolución real)
  async consultarPrestamosActivos() {
    return await Prestamo.findAll({
      where: {
        fecha_dev_real: null
      },
      include: [
        { model: Libro, as: 'libro', attributes: ['titulo', 'isbn'] },
        { model: Usuario, as: 'usuario', attributes: ['nombre', 'email'] }
      ]
    });
  }
}

module.exports = new BibliotecaService();