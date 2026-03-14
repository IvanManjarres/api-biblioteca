const express = require('express');
const router  = express.Router();
const { registrar, devolver, obtenerActivos } = require('../controllers/prestamoController');

router.post('/',            registrar);
router.put('/:id/devolver', devolver);
router.get('/activos',      obtenerActivos);

module.exports = router;