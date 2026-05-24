const { sequelize, Autor, Libro, Usuario } = require('./models');
const service = require('./services/bibliotecaService');

async function correrPruebas() {
  try {
    // Sincronizar base de datos limpia (fuerza la recreación de tablas en entorno de desarrollo)
    await sequelize.sync({ force: true });
    console.log('✔ Base de datos sincronizada correctamente.');

    console.log('\n--- [R7] Insertando Seeds de Prueba ---');
    
    // 1. Crear 3 Autores
    const a1 = await Autor.create({ nombre: 'Gabriel', apellido: 'García Márquez', nacionalidad: 'Colombiana' });
    const a2 = await Autor.create({ nombre: 'Isabel', apellido: 'Allende', nacionalidad: 'Chilena' });
    const a3 = await Autor.create({ nombre: 'Jorge', apellido: 'Luis Borges', nacionalidad: 'Argentina' });

    // 2. Crear 2 Usuarios
    const u1 = await Usuario.create({ nombre: 'Gaylet Paternina', email: 'gaylet@correo.com' });
    const u2 = await Usuario.create({ nombre: 'Carlos Mendoza', email: 'carlos@correo.com' });

    // 3. Crear 5 Libros (Usando el servicio para asociar autores inmediatamente)
    const l1 = await service.registrarLibroConAutores({ titulo: 'Cien años de soledad', isbn: '978-0307474728', anio_publicacion: 1967, copias_disponibles: 3 }, [a1.id]);
    const l2 = await service.registrarLibroConAutores({ titulo: 'La casa de los espíritus', isbn: '978-1501117015', anio_publicacion: 1882, copias_disponibles: 1 }, [a2.id]);
    const l3 = await service.registrarLibroConAutores({ titulo: 'Ficciones', isbn: '978-1101974018', anio_publicacion: 1944, copias_disponibles: 5 }, [a3.id]);
    const l4 = await service.registrarLibroConAutores({ titulo: 'El amor en los tiempos del cólera', isbn: '978-0307387264', anio_publicacion: 1985, copias_disponibles: 0 }, [a1.id]); // Sin stock intencional
    const l5 = await service.registrarLibroConAutores({ titulo: 'Eva Luna', isbn: '978-1439160917', anio_publicacion: 1987, copias_disponibles: 2 }, [a2.id]);

    console.log('✔ Seeds insertados de manera exitosa.');

    console.log('\n--- [R4] Ejecutando Pruebas de Flujo CRUD y Transacciones ---');

    // Prueba de listado sin N+1
    const listadoActivos = await service.listarLibrosActivos();
    console.log(`Libros activos recuperados (con Eager Loading): ${listadoActivos.length}`);

    // Crear 2 préstamos iniciales válidos
    const p1 = await service.registrarPrestamo(u1.id, l1.id);
    console.log(`✔ Préstamo exitoso 1: "${l1.titulo}" entregado a ${u1.nombre}.`);
    
    const p2 = await service.registrarPrestamo(u2.id, l2.id);
    console.log(`✔ Préstamo exitoso 2: "${l2.titulo}" entregado a ${u2.Carlos}.`);

    // Intentar prestar el libro l4 que se inicializó con 0 copias (Debe fallar por R6)
    try {
      console.log('\nProbando validación de stock cero (R6)...');
      await service.registrarPrestamo(u1.id, l4.id);
    } catch (err) {
      console.log(`❌ Capturado correctamente: ${err.message}`);
    }

    // Consultar préstamos activos
    let activos = await service.consultarPrestamosActivos();
    console.log(`\nCantidad de préstamos activos en este momento: ${activos.length}`);

    // Realizar devolución de un libro
    console.log(`\nProcesando devolución del préstamo ID: ${p2.id}...`);
    await service.registrarDevolucion(p2.id);
    
    // Validar que se reincorporó la copia disponible
    const l2Actualizado = await Libro.findByPk(l2.id);
    console.log(`✔ Copias disponibles actuales de "${l2Actualizado.titulo}": ${l2Actualizado.copias_disponibles}`);

    activos = await service.consultarPrestamosActivos();
    console.log(`Cantidad de préstamos activos post-devolución: ${activos.length}`);

  } catch (error) {
    console.error('Error durante la ejecución de la suite de pruebas del backend:', error);
  } finally {
    await sequelize.close();
  }
}

correrPruebas();