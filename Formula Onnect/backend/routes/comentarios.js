const express = require('express');
const router = express.Router();
const db = require('../controllers/comentariosController');

router.get('/', db.getAllComentarios); // Buscar todos los comentarios
router.get('/:id', db.getComentariosByIdComentario); // Buscar un comentario por ID
router.get('/publicacion/:id', db.getComentariosByIdPublicacion); // Buscar los comentarios de una publicación por ID
router.get('/comentarioPadre/:id', db.getComentariosByComentarioPadre); // Buscar los comentarios de un comentario por el comentario padre
router.get('/numero/:id', db.getNumeroComentariosByIdPublicacion); // Buscar el número de comentarios de una publicación por ID
router.get('/numeroComentarioPadre/:id', db.getNumeroComentariosByComentarioPadre); // Buscar el número de comentarios de un comentario por el comentario padre
router.post('/', db.createComentarios); // Crear un nuevo comentario

module.exports = router;