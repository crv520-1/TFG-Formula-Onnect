const express = require('express');
const router = express.Router();
const db = require('../controllers/seguidoresController');

router.get('/', db.getAllSeguidores); // Buscar a todos los seguidores
router.get('/:id', db.getAllSigo); // Buscar a quien sigo
router.get('/:nickName', db.getAllMeSiguen); // Buscar quien me sigue
router.post('/', db.createSeguimiento); // Crear un nuevo seguimiento

module.exports = router;
