// Contexto para poder pasar el id del usuario desde IniciarSession.jsx al resto de vistas a las que se accede desde el Dashboard.
import React, { createContext, useState } from 'react';

export const UsuarioContext = createContext();

export const UsuarioProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const updateUser = (userId) => {
      setUser(userId);
      console.log("User updated:", userId);
  };

  return (
      <UsuarioContext.Provider value={{ user, setUser: updateUser }}>
          {children}
      </UsuarioContext.Provider>
  );
};