const Libro = require('../models/libro');

// GET /api/libros
const obtenerTodos = async (req, res) => {
  try {
    const libros = await Libro.findAll();
    res.json(libros);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener libros', error: error.message });
  }
};

// GET /api/libros/:id
const obtenerPorId = async (req, res) => {
  try {
    const libro = await Libro.findByPk(req.params.id);
    if (!libro) return res.status(404).json({ mensaje: 'Libro no encontrado' });
    res.json(libro);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener libro', error: error.message });
  }
};

// POST /api/libros
const crear = async (req, res) => {
  try {
    const { titulo, autor, isbn, cantidad } = req.body;
    if (!titulo || !autor || !isbn || !cantidad) {
      return res.status(400).json({ mensaje: 'Todos los campos son requeridos' });
    }
    const libro = await Libro.create({ titulo, autor, isbn, cantidad, disponibles: cantidad });
    res.status(201).json(libro);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ mensaje: 'Ya existe un libro con ese ISBN' });
    }
    res.status(500).json({ mensaje: 'Error al crear libro', error: error.message });
  }
};

// PUT /api/libros/:id
const actualizar = async (req, res) => {
  try {
    const libro = await Libro.findByPk(req.params.id);
    if (!libro) return res.status(404).json({ mensaje: 'Libro no encontrado' });
    await libro.update(req.body);
    res.json(libro);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar libro', error: error.message });
  }
};

// DELETE /api/libros/:id
const eliminar = async (req, res) => {
  try {
    const libro = await Libro.findByPk(req.params.id);
    if (!libro) return res.status(404).json({ mensaje: 'Libro no encontrado' });

    // Verificar préstamos activos
    const Prestamo = require('../models/prestamo');
    const prestamosActivos = await Prestamo.count({
      where: { libroId: req.params.id, fechaDevolucion: null }
    });
    if (prestamosActivos > 0) {
      return res.status(400).json({ mensaje: 'No se puede eliminar el libro porque tiene préstamos activos' });
    }

    await libro.destroy();
    res.json({ mensaje: 'Libro eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar libro', error: error.message });
  }
};

// GET /api/libros/disponibles
const obtenerDisponibles = async (req, res) => {
  try {
    const libros = await Libro.findAll({ where: { disponibles: { [require('sequelize').Op.gt]: 0 } } });
    res.json(libros);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener libros disponibles', error: error.message });
  }
};

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar, obtenerDisponibles };