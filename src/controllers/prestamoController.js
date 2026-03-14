const Prestamo = require('../models/prestamo');
const Libro    = require('../models/libro');
const Usuario  = require('../models/usuario');

// POST /api/prestamos — Registrar préstamo
const registrar = async (req, res) => {
  try {
    const { libroId, usuarioId } = req.body;
    if (!libroId || !usuarioId) {
      return res.status(400).json({ mensaje: 'libroId y usuarioId son requeridos' });
    }
    const libro = await Libro.findByPk(libroId);
    if (!libro) return res.status(404).json({ mensaje: 'Libro no encontrado' });
    if (libro.disponibles <= 0) {
      return res.status(400).json({ mensaje: 'No hay copias disponibles de este libro' });
    }
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const prestamo = await Prestamo.create({ libroId, usuarioId });
    await libro.update({ disponibles: libro.disponibles - 1 });

    res.status(201).json(prestamo);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar préstamo', error: error.message });
  }
};

// PUT /api/prestamos/:id/devolver — Registrar devolución
const devolver = async (req, res) => {
  try {
    const prestamo = await Prestamo.findByPk(req.params.id);
    if (!prestamo) return res.status(404).json({ mensaje: 'Préstamo no encontrado' });
    if (prestamo.fechaDevolucion) {
      return res.status(400).json({ mensaje: 'Este préstamo ya fue devuelto' });
    }
    await prestamo.update({ fechaDevolucion: new Date() });
    const libro = await Libro.findByPk(prestamo.libroId);
    await libro.update({ disponibles: libro.disponibles + 1 });

    res.json(prestamo);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar devolución', error: error.message });
  }
};

// GET /api/prestamos/activos — Ver préstamos activos
const obtenerActivos = async (req, res) => {
  try {
    const prestamos = await Prestamo.findAll({
      where: { fechaDevolucion: null },
      include: [
        { model: require('../models/libro'),   as: 'libro',   attributes: ['id', 'titulo', 'autor'] },
        { model: require('../models/usuario'), as: 'usuario', attributes: ['id', 'nombre', 'email'] }
      ]
    });
    res.json(prestamos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener préstamos activos', error: error.message });
  }
};

module.exports = { registrar, devolver, obtenerActivos };