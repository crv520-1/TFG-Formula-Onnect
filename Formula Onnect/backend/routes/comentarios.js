const express = require('express');
const router = express.Router();
const db = require('../controllers/comentariosController');

router.get('/', db.getAllComentarios); // Buscar todos los comentarios
router.get('/:id', db.getComentariosByIdComentario); // Buscar un comentario por ID
router.get('/publicacion/:id', db.getComentariosByIdPublicacion); // Buscar los comentarios de una publicación por ID
router.post('/', db.createComentarios); // Crear un nuevo comentario

module.exports = router;