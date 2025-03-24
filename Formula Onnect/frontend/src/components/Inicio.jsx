import { ChatBubbleOvalLeftIcon, HandThumbUpIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";

export const Inicio = () => {
  const navigate = useNavigate();
  const { user: idUsuario } = useContext(UsuarioContext);
  const [publicacionesConUsuarios, setPublicacionesConUsuarios] = useState([]);
  const [meGustasPublicaciones, setMeGustasPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Función para cargar publicaciones y datos de usuarios
  const cargarPublicaciones = async () => {
    try {
      // Obtener todas las publicaciones
      const publicacionesResponse = await axios.get(`http://localhost:3000/api/publicaciones`);
      const publicacionesEncontradas = publicacionesResponse.data || [];
      
      if (publicacionesEncontradas.length === 0) {
        console.error("No hay publicaciones");
        setCargando(false);
        return;
      }
              
      // Obtener los datos de todos los usuarios de las publicaciones de una vez
      const usuariosPublicadoresResponse = await axios.get("http://localhost:3000/api/usuarios");
      const usuariosPublicadores = usuariosPublicadoresResponse.data || [];
      
      // Crear un mapa de usuarios para acceso rápido
      const mapaUsuarios = {};
      usuariosPublicadores.forEach(user => {
        mapaUsuarios[user.idUsuario] = user;
      });
      
      // Combinar publicaciones con datos de usuarios
      const publicacionesCompletas = publicacionesEncontradas.map(publicacion => {
        const usuarioPublicador = mapaUsuarios[publicacion.usuario];
        return {
          ...publicacion,
          usuarioPublicador: usuarioPublicador || null
        };
      });
      
      setPublicacionesConUsuarios(publicacionesCompletas);
      setCargando(false);
    } catch (error) {
      console.error("Error obteniendo publicaciones:", error);
      setCargando(false);
    }
  };

  // Función para cargar me gustas
  const cargarMeGustas = async () => {
    if (publicacionesConUsuarios.length === 0) return;
    
    try {
      // Crear un array con los IDs de las publicaciones
      const idsPublicaciones = publicacionesConUsuarios.map(publicacion => publicacion.idPublicaciones);
      
      if (idsPublicaciones.length === 0) return;
      
      // Acumular todos los me gustas
      let todosLosMeGustas = [];
      
      // Obtener los me gustas para cada publicación individualmente
      for (let i = 0; i < idsPublicaciones.length; i++) {
        const meGustaResponse = await axios.get(`http://localhost:3000/api/meGusta/${idsPublicaciones[i]}`);
        const meGusta = meGustaResponse.data || [];
        
        // Acumular los me gustas en lugar de sobreescribir
        todosLosMeGustas = [...todosLosMeGustas, ...meGusta];
      }
      
      // Establecer todos los me gustas acumulados
      setMeGustasPublicaciones(todosLosMeGustas);
    } catch (error) {
      console.error("Error obteniendo me gustas:", error);
      setMeGustasPublicaciones([]);
    }
  };

  // Cargar publicaciones al inicio
  useEffect(() => {
    cargarPublicaciones();
  }, [idUsuario]);

  // Cargar me gustas cuando se actualizan las publicaciones
  useEffect(() => {
    cargarMeGustas();
  }, [publicacionesConUsuarios]);

  const handleMeGusta = async (idPublicacion) => {
    try {
      const meGustasResponse = await axios.get(`http://localhost:3000/api/meGusta`);
      const meGustas = meGustasResponse.data || [];
      
      // Verificar si ya dio me gusta
      if (meGustas.some(meGusta => meGusta.idElemento === idPublicacion && meGusta.idUser === idUsuario)) {
        alert("Ya has dado me gusta a esta publicación");
        return;
      }
      
      // Añadir nuevo me gusta
      const nuevoMeGusta = {
        idUser: idUsuario,
        idElemento: idPublicacion
      };
      
      await axios.post("http://localhost:3000/api/meGusta", nuevoMeGusta);
      
      // Actualizar me gustas sin recargar la página
      cargarMeGustas();
    } catch (error) {
      console.error("Error al dar me gusta:", error);
    }
  };

  const handleComentarios = (idPublicacion) => {
    // Navegar a comentarios con el ID de la publicación
    navigate(`/Comentarios`, { state: { idElemento: idPublicacion } });
  };

  const handleVisitarPerfil = (idUser) => {
    if (idUser === idUsuario) {
      navigate("/Perfil");
    } else {
      navigate(`/OtroPerfil`, {state: { idUser }});
    }
  };

  // Función para obtener el contador de me gustas para una publicación específica
  const obtenerContadorMeGusta = (idPublicacion) => {
    const meGusta = meGustasPublicaciones.find(mg => mg.idElemento === idPublicacion);
    return meGusta ? meGusta.contador : 0;
  };

  if (cargando) {
    return <div>Cargando publicaciones...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", maxHeight: "98vh", overflow: "auto" }}>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", paddingBottom: "2vh" }} >
        <h2 style={{ backgroundColor: "#C40000", borderRadius:"0.5vh", width: "15vh", fontSize:"2vh", textAlign: "center" }}>Publicaciones</h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", maxHeight: "100%", overflow: "auto", paddingRight:"2vh" }}>
        {publicacionesConUsuarios.map((publicacion) => (
          <div key={publicacion.idPublicaciones} style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor:"#2c2c2c", width:"50vw", height:"auto", borderRadius:"1vh", marginBottom: "2vh" }}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%", paddingTop:"1vh", paddingLeft: "1vh", paddingRight: "1vh" }}>
              {publicacion.usuarioPublicador && (
                <div style={{ marginLeft: "1vw", display: "flex", flexDirection: "row", alignItems: "center" }}>
                  <button style={{ border:"none", backgroundColor:"#2c2c2c", display: "flex", flexDirection: "row", alignItems: "center" }} onClick={() => handleVisitarPerfil(publicacion.usuarioPublicador.idUsuario)}>
                    <img src={publicacion.usuarioPublicador.fotoPerfil} alt="Perfil" style={{ width: "3vh", height: "3vh", borderRadius: "50%", backgroundColor:"white" }} />
                    <p style={{marginLeft:"1vw", fontSize:"1.5vh"}}>{publicacion.usuarioPublicador.nickName}</p>
                  </button>
                </div>
              )}
              <p style={{marginLeft:"2vw", fontSize:"1.5vh"}}>{new Date(publicacion.fechaPublicacion).toLocaleDateString()}</p>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
                <p style={{fontSize:"1.5vh"}}>{obtenerContadorMeGusta(publicacion.idPublicaciones)}</p>
                <button type='button' onClick={() => handleMeGusta(publicacion.idPublicaciones)} style={{ fontSize: "2vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", height:"3vh", border: "none", backgroundColor:"#2c2c2c" }}> <HandThumbUpIcon style={{ width: "2vh", height: "2vh" }} /> </button>
                <p style={{marginLeft:"1vw", fontSize:"1.5vh"}}>0</p>
                <button type='button' onClick={() => handleComentarios(publicacion.idPublicaciones)} style={{ fontSize: "2vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", height:"3vh", border: "none", backgroundColor:"#2c2c2c" }}><ChatBubbleOvalLeftIcon style={{ width: "2vh", height: "2vh" }} /></button>
              </div>
            </div>
            <button style={{margin:"1vh", fontSize:"2vh", backgroundColor:"#2c2c2c", border: "none", textAlign: "left", width: "100%"}} onClick={() => handleComentarios(publicacion.idPublicaciones)}>{publicacion.texto}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inicio;