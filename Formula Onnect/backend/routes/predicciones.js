const express = require('express');
const router = express.Router();
const db = require('../controllers/prediccionesController');

router.get('/', db.getAllPredicciones); // Buscar todas las predicciones
router.get('/:id', db.getPrediccionesByIdUsuario); // Buscar las predicciones de un usuario por ID
router.post('/', db.createPredicciones); // Crear una nueva predicción

module.exports = router;