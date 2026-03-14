const express = require('express');
const router = express.Router();
const {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
  buscar
} = require('../controllers/usuarioController');

router.get('/buscar', buscar);
router.get('/', obtenerTodos);
router.get('/:id', obtenerPorId);
router.post('/', crear);
router.put('/:id', actualizar);
router.delete('/:id', eliminar);

module.exports = router;