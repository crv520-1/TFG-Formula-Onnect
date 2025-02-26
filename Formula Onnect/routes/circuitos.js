const express = require('express');
const router = express.Router();
const circuitosController = require('../controllers/circuitosController');

router.get('/', circuitosController.getAllCircuitos); // Buscar todos los circuitos
router.get('/:id', circuitosController.getCircuitosByIdCircuito); // Buscar un circuito por ID
router.post('/', circuitosController.postCircuitos); // Crear un nuevo circuito

module.exports = router;
