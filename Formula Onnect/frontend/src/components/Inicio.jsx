import { ChatBubbleOvalLeftIcon, HandThumbUpIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";

export const Inicio = () => {
  const navigate = useNavigate();
  const { user: idUsuario } = useContext(UsuarioContext);
  const [usuarioVisualizador, setUsuarioVisualizador] = useState(null);
  const [publicacionesConUsuarios, setPublicacionesConUsuarios] = useState([]);
  const [meGustasPublicaciones, setMeGustasPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener usuario visualizador (el usuario actual)
        const usuariosResponse = await axios.get("http://localhost:3000/api/usuarios");
        const usuarioEncontrado = usuariosResponse.data.find(user => user.idUsuario === idUsuario);
        if (!usuarioEncontrado) {
          console.error("Usuario no encontrado");
          return;
        }
        setUsuarioVisualizador(usuarioEncontrado);

        // Obtener todas las publicaciones
        const publicacionesResponse = await axios.get(`http://localhost:3000/api/publicaciones`);
        const publicacionesEncontradas = publicacionesResponse.data;
        if (!publicacionesEncontradas || !publicacionesEncontradas.length) {
          console.error("No hay publicaciones");
          setCargando(false);
          return;
        }
                
        // Obtener los datos de todos los usuarios de las publicaciones de una vez
        const usuariosPublicadoresResponse = await axios.get("http://localhost:3000/api/usuarios");
        const usuariosPublicadores = usuariosPublicadoresResponse.data;
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

        // Obtener los me gustas de las publicaciones
        const meGustaResponse = await axios.get(`http://localhost:3000/api/meGusta/${publicacionesConUsuarios.map(publicacion => publicacion.idPublicaciones)}`);
        const meGusta = meGustaResponse.data;
        if (!meGusta) {
          console.error("No hay me gusta");
          setCargando(false);
          return;
        }
        setMeGustasPublicaciones(meGusta);
        setCargando(false);
      } catch (error) {
        console.error("Error obteniendo datos:", error);
        setCargando(false);
      }
    };
    
    fetchData();
  }, [idUsuario, meGustasPublicaciones]);

  const handleMeGusta = async (idPublicacion) => {
    const meGustasResponse = await axios.get(`http://localhost:3000/api/meGusta`);
    const meGustas = meGustasResponse.data;
    if (!meGustas || !meGustas.length) {
      anadirMeGusta(idPublicacion);
    } else {
      if (meGustas.find(meGusta => meGusta.idElemento === idPublicacion && meGusta.idUser === idUsuario)) {
        alert("Ya has dado me gusta a esta publicación");
        return;
      } else {
        anadirMeGusta(idPublicacion);
      }
    }
  }

  async function anadirMeGusta(idPublicacion) {
    const nuevoMeGusta = {
      idUser: idUsuario,
      idElemento: idPublicacion
    };
    try {
      await axios.post("http://localhost:3000/api/meGusta", nuevoMeGusta);
    } catch (error) {
      console.error("Error al dar me gusta:", error);
    }
    navigate("/Inicio");
  }

  const handleComentarios = (idPublicacion) => {
    console.log("Comentarios en publicación:", idPublicacion);
    // Aquí implementarías la lógica para mostrar/añadir comentarios
    navigate(`/Comentarios`);
  }

  const handleVisitarPerfil = (idUser) => {
    console.log("Visitar perfil");
    // Aquí implementarías la lógica para visitar el perfil del usuario
    if (idUser === idUsuario) {
      navigate("/Perfil");
    } else {
      console.log("Visitar perfil de otro usuario:", idUser);
      navigate(`/OtroPerfil`, {state: { idUser }});
    }
  }

  if (cargando) {
    return <div>Cargando publicaciones...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }} >
      <h2 style={{ backgroundColor: "#C40000", borderRadius:"0.5vh", width: "15vh", fontSize:"2vh", textAlign: "center" }}>Publicaciones</h2>
      <div style={{ paddingTop:"2vh"}}>
        {publicacionesConUsuarios.map((publicacion) => {
          return (
            <div key={publicacion.idPublicacion} style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor:"#2c2c2c", width:"50vw", height:"auto", borderRadius:"1vh", marginBottom: "2vh" }}>
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
                {meGustasPublicaciones.map(meGusta => {
                  if (meGusta.idElemento === publicacion.idPublicaciones) {
                    return (
                      <div key={meGusta.idElemento} style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
                        <p style={{fontSize:"1.5vh"}}>{meGusta.contador}</p>
                        <button type='button' onClick={() => handleMeGusta(publicacion.idPublicaciones)} style={{ fontSize: "2vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", height:"3vh", border: "none", backgroundColor:"#2c2c2c" }}> <HandThumbUpIcon style={{ width: "2vh", height: "2vh" }} /> </button>
                          <p style={{marginLeft:"1vw", fontSize:"1.5vh"}}>0</p>
                        <button type='button' onClick={() => handleComentarios(publicacion.idPublicaciones)} style={{ fontSize: "2vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", height:"3vh", border: "none", backgroundColor:"#2c2c2c" }}><ChatBubbleOvalLeftIcon style={{ width: "2vh", height: "2vh" }} /></button>
                      </div>
                    )}
                  })
                }
              </div>
              <button style={{margin:"1vh", fontSize:"2vh", backgroundColor:"#2c2c2c", border: "none", textAlign: "left", width: "100%"}} onClick={() => handleComentarios(publicacion.idPublicaciones)}>{publicacion.texto}</button>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default Inicio;