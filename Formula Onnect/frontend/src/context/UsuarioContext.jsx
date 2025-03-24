// Contexto para poder pasar el id del usuario desde IniciarSession.jsx al resto de vistas a las que se accede desde el Dashboard.
import PropTypes from 'prop-types';
import { createContext, useState } from 'react';

export const UsuarioContext = createContext();

export const UsuarioProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Recuperar el usuario del localStorage al cargar la aplicación
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const updateUser = (userId) => {
    setUser(userId);
    // Guardar el usuario en localStorage
    localStorage.setItem('user', JSON.stringify(userId));
    console.log("User updated:", userId);
  };

  const clearUser = () => {
    setUser(null);
    // Eliminar el usuario del localStorage
    localStorage.removeItem('user');
    console.log("User cleared");
  };

  return (
    <UsuarioContext.Provider value={{ user, setUser: updateUser, clearUser }}>
      {children}
    </UsuarioContext.Provider>
  );
};

UsuarioProvider.propTypes = {
  children: PropTypes.node.isRequired,
};