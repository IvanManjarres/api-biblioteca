const { Op } = require('sequelize');
const Usuario = require('../models/usuario');

// GET /api/usuarios
const obtenerTodos = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message });
  }
};

// GET /api/usuarios/:id
const obtenerPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuario', error: error.message });
  }
};

// POST /api/usuarios
const crear = async (req, res) => {
  try {
    const { nombre, email, cedula } = req.body;
    if (!nombre || !email || !cedula) {
      return res.status(400).json({ mensaje: 'Todos los campos son requeridos: nombre, email, cédula' });
    }
    const usuario = await Usuario.create({ nombre, email, cedula });
    res.status(201).json(usuario);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ mensaje: 'Ya existe un usuario con ese email o cédula' });
    }
    res.status(500).json({ mensaje: 'Error al crear usuario', error: error.message });
  }
};

// PUT /api/usuarios/:id
const actualizar = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    await usuario.update(req.body);
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar usuario', error: error.message });
  }
};

// DELETE /api/usuarios/:id
const eliminar = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    await usuario.destroy();
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar usuario', error: error.message });
  }
};

// GET /api/usuarios/buscar?q=
const buscar = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ mensaje: 'Debes enviar un parámetro de búsqueda ?q=' });
    const usuarios = await Usuario.findAll({
      where: {
        [Op.or]: [
          { email: { [Op.like]: `%${q}%` } },
          { cedula: { [Op.like]: `%${q}%` } }
        ]
      }
    });
    if (usuarios.length === 0) return res.status(404).json({ mensaje: 'No se encontró ningún usuario' });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar usuario', error: error.message });
  }
};

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar, buscar };