const express = require('express');
const router = express.Router();
const db = require('../controllers/meGustaController');

router.get('/', db.getAllMeGusta); // Buscar todos los me gusta
router.get('/:idElemento', db.getMeGustaById); // Buscar los me gusta por idElemento
router.post('/', db.createMeGusta); // Crear un nuevo me gusta

module.exports = router;