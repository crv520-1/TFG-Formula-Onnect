const express = require('express');
const router = express.Router();
const db = require('../controllers/meGustaController');

router.get('/', db.getAllMeGusta); // Buscar todos los me gusta
router.get('/:id', db.getMeGustaById); // Buscar un me gusta por ID
router.get('/:idElemento/:tipoElemento', db.getMeGustaByElementoYTipo); // Buscar los me gusta por idElemento y tipoElemento
router.post('/', db.createMeGusta); // Crear un nuevo me gusta

module.exports = router;