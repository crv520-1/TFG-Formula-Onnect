const express = require('express');
const router = express.Router();
const db = require('../controllers/publicacionesController');

router.get('/', db.getAllPublicaciones); // Buscar todas las publicaciones
router.get('/:id', db.getPublicacionesByIdUsuario); // Buscar las publicaciones de un usuario por ID
router.post('/', db.createPublicaciones); // Crear una nueva publicación

module.exports = router;