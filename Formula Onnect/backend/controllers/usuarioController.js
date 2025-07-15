const usuarioModel = require('../models/usuarioModel.js');
const bcrypt = require('bcrypt');

// Obtener todos los usuarios
exports.getAllUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioModel.getAllUsuarios();
        res.json(usuarios);
      } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un usuario por su id
exports.getUsuarioById = async (req, res) => {
    const idUsuario = req.params.id;

    try {
        const usuario = await usuarioModel.getUsuarioById(idUsuario);
        if (usuario.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        return res.json(usuario[0]);
    } catch (error) {
        console.error("Error en la API:", error);
        return res.status(500).json({ error: 'Error al buscar en la base de datos' });
    }
};


// Obtener un usuario por su nickName
exports.getUsuarioByNickName = (req, res) => {
    const nickName = req.params.nickName;

    usuarioModel.getUsuarioByNickName(nickName, (err, results) => {
        if (err) {
            return res.status(500).json({error: 'Error al buscar en la base de datos'});
        }
        if (results.length === 0) {
            return res.status(404).json({error: 'Usuario no encontrado'});
        }
        res.json(results[0]);
    });
}

// Login de usuario
exports.loginUsuario = async (req, res) => {
    const { nickName, contrasena } = req.body;
    try {
        const usuario = await usuarioModel.getUsuarioByNickNameForLogin(nickName);
        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const match = await bcrypt.compare(contrasena, usuario.contrasena);
        if (match) {
            // No devolver la contraseña en la respuesta
            const { contrasena, ...usuarioSinContrasena } = usuario;
            res.json({ message: 'Login exitoso', usuario: usuarioSinContrasena });
        } else {
            res.status(401).json({ error: 'Credenciales inválidas' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// Crear un nuevo usuario
exports.createUsuario = async (req, res) => {
    try {
      const usuario = req.body;
      const insertId = await usuarioModel.createUsuario(usuario);
      res.status(201).json({ message: 'Usuario creado exitosamente.', id: insertId });
    } catch (error) {
      console.error("Error en createUsuario:", error);
      res.status(500).json({ error: 'Error al crear el usuario en la base de datos.' });
    }
};
  
// Actualizar un usuario
exports.updateUsuario = async (req, res) => {
    try {
      const idUsuario = req.params.id;
      const usuario = req.body;
      const affectedRows = await usuarioModel.updateUsuario(idUsuario, usuario);
  
      if (affectedRows === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado o sin cambios.' });
      }
  
      res.json({ message: 'Usuario actualizado exitosamente.' });
    } catch (error) {
      console.error("Error en updateUsuario:", error);
      res.status(500).json({ error: 'Error al actualizar el usuario en la base de datos.' });
    }
};
  