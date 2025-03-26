const express = require('express');
const router = express.Router();
const db = require('../controllers/meGustaComentariosController');

router.get('/', db.getAllMeGustaComentarios); // Buscar todos los me gusta de comentarios
router.get('/:idComentario', db.getMeGustaComentariosById); // Buscar los me gusta por idComentario
router.get('/numero/:idComentario', db.getMeGustaComentariosCount); // Buscar el numero total de me gusta de un comentario
router.post('/', db.createMeGustaComentarios); // Crear un nuevo me gusta de comentario
router.delete('/:iDusuario/:idComent', db.deleteMeGustaComentarios); // Eliminar un me gusta de comentario

module.exports = router;