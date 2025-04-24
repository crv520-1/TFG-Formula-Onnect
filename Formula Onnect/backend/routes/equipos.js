const express = require('express');
const router = express.Router();
const db = require('../controllers/equiposController');

router.get('/', db.getAllEquipos); // Buscar todos los equipos
router.get('/:id', db.getEquiposByIdEquipo); // Buscar un equipo por ID
router.get('/constructorId/:constructorId', db.getEquiposByConstructorId); // Buscar un equipo por constructorId
router.post('/', db.postEquipos); // Crear un nuevo equipo

module.exports = router;