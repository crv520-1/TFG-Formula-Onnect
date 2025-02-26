const express = require('express');
const router = express.Router();
const db = require('../controllers/usuarioController');

router.get('/', db.getAllUsuarios); // Buscar a todos los usuarios
router.get('/:id', db.getUsuarioById); // Buscar un usuario por ID
router.get('/:id', db.getUsuarioByNickName); // Buscar un usuario por nickName
router.post('/', db.createUsuario); // Crear un nuevo usuario

module.exports = router;
