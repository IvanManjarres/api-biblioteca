const express = require('express');
const router  = express.Router();
const { registrar, devolver, obtenerActivos, historialPorUsuario } = require('../controllers/prestamoController');

router.post('/',              registrar);
router.put('/:id/devolver',   devolver);
router.get('/activos',        obtenerActivos);
router.get('/usuario/:id',    historialPorUsuario); // ← agregar

module.exports = router;