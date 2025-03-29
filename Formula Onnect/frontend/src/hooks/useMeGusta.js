import axios from 'axios';

export const useMeGusta = () => {
  const handleMeGusta = async (idUsuario, idPublicacion, onSuccess) => {
    try {
      const meGustasResponse = await axios.get(`http://localhost:3000/api/meGusta`);
      const meGustas = meGustasResponse.data || [];
      
      // Verificar si ya dio me gusta
      if (meGustas.some(meGusta => 
        meGusta.idElemento === idPublicacion && 
        meGusta.idUser === idUsuario
      )) {
        // Eliminar me gusta
        await axios.delete(`http://localhost:3000/api/meGusta/${idUsuario}/${idPublicacion}`);
      } else {
        // Añadir nuevo me gusta
        const nuevoMeGusta = {
          idUser: idUsuario,
          idElemento: idPublicacion
        };
        await axios.post("http://localhost:3000/api/meGusta", nuevoMeGusta);
      }
      
      // Ejecutar callback de éxito (actualizar estado)
      if (onSuccess) onSuccess(idPublicacion);

    } catch (error) {
      console.error("Error al dar me gusta:", error);
    }
  };

  return { handleMeGusta };
};