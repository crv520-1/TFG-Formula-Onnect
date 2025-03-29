import { HandThumbUpIcon as NoMeGustaIcono } from "@heroicons/react/24/outline";
import { ChatBubbleOvalLeftIcon, HandThumbUpIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";
import { useMeGusta } from '../hooks/useMeGusta';

export const Inicio = () => {
  const navigate = useNavigate();
  const { user: idUsuario } = useContext(UsuarioContext);
  const [userLikes, setUserLikes] = useState({});
  const [publicacionesConUsuarios, setPublicacionesConUsuarios] = useState([]);
  const [meGustasPublicaciones, setMeGustasPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { handleMeGusta } = useMeGusta();

  // Cargar publicaciones al inicio
  useEffect(() => {
    cargarPublicaciones();
  }, [idUsuario]);

  // Cargar me gustas cuando se actualizan las publicaciones
  useEffect(() => {
    cargarMeGustas();
    if (publicacionesConUsuarios.length > 0) {
      cargarLikesUsuario();
    }
  }, [publicacionesConUsuarios]);

  // Función para cargar publicaciones y datos de usuarios
  const cargarPublicaciones = async () => {
    try {
      // Obtener todas las publicaciones
      const publicacionesResponse = await axios.get(`http://localhost:3000/api/publicaciones`);
      const publicacionesEncontradas = publicacionesResponse.data || [];
      
      if (publicacionesEncontradas.length === 0) {
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
      const publicacionesCompletas = await Promise.all(
        publicacionesEncontradas.map(async (publicacion) => {
          const usuarioPublicador = mapaUsuarios[publicacion.usuario];
          const comentarios = await cargarComentarios(publicacion.idPublicaciones); // Esperar a que se resuelva
          return {
            ...publicacion,
            usuarioPublicador: usuarioPublicador || null,
            numeroComentarios: comentarios.contador || 0, // Usar la longitud de los comentarios
          };
        })
      );
      
      setPublicacionesConUsuarios(publicacionesCompletas);
      setCargando(false);
    } catch (error) {
      console.error("Error obteniendo publicaciones:", error);
      setCargando(false);
    }
  };

  const cargarComentarios = async (idPublicacion) => {
    try {
      const comentariosResponse = await axios.get(`http://localhost:3000/api/comentarios/numero/${idPublicacion}`);
      const comentarios = comentariosResponse.data || [];
      return comentarios;
    } catch (error) {
      console.error("Error obteniendo comentarios:", error);
      return [];
    }
  };

  // Función para cargar me gustas
  const cargarMeGustas = async () => {
    if (!publicacionesConUsuarios.length) return;
    
    try {
      const meGustasPromises = publicacionesConUsuarios.map(publicacion => 
        axios.get(`http://localhost:3000/api/meGusta/${publicacion.idPublicaciones}`)
      );
      
      const responses = await Promise.all(meGustasPromises);
      const todosLosMeGustas = responses.flatMap(response => response.data || []);
      
      setMeGustasPublicaciones(todosLosMeGustas);
    } catch (error) {
      console.error("Error obteniendo me gustas:", error);
      setMeGustasPublicaciones([]);
    }
  };

  const handleMeGustaPublicacion = async (idPublicacion) => {
    await handleMeGusta(idUsuario, idPublicacion);
    
    setUserLikes(prevLikes => ({
      ...prevLikes,
      [idPublicacion]: !prevLikes[idPublicacion]
    }));
  
    setMeGustasPublicaciones(prevMeGustas => {
      const currentMeGusta = prevMeGustas.find(mg => mg.idElemento === idPublicacion);
      if (currentMeGusta) {
        const newContador = userLikes[idPublicacion] ? currentMeGusta.contador - 1 : currentMeGusta.contador + 1;
        return prevMeGustas.map(mg => 
          mg.idElemento === idPublicacion ? {...mg, contador: newContador} : mg
        );
      }
      return [...prevMeGustas, { idElemento: idPublicacion, contador: 1 }];
    });
  
    await Promise.all([
      cargarMeGustas(),
      cargarLikesUsuario()
    ]);
  };

  const handleComentarios = (idPublicacion) => {
    // Navegar a comentarios con el ID de la publicación
    navigate(`/Comentarios`, { state: { idElemento: idPublicacion, previusPath: 0 } });
  };

  const handleVisitarPerfil = (idUser) => {
    if (idUser === idUsuario) {
      navigate("/Perfil");
    } else {
      navigate(`/Perfil`, {state: { idUser }});
    }
  };

  // Función para obtener el contador de me gustas para una publicación específica
  const obtenerContadorMeGusta = (idPublicacion) => {
    const meGusta = meGustasPublicaciones.find(mg => mg.idElemento === idPublicacion);
    return meGusta ? meGusta.contador : 0;
  };

  const cargarLikesUsuario = async () => {
    try {
      const likesPromises = publicacionesConUsuarios.map(publicacion =>
        axios.get(`http://localhost:3000/api/meGusta/elemento/${publicacion.idPublicaciones}`)
      );
      
      const responses = await Promise.all(likesPromises);
      const likesTemp = {};
      
      responses.forEach((response, index) => {
        const publicacionId = publicacionesConUsuarios[index].idPublicaciones;
        const meGustas = response.data || [];
        likesTemp[publicacionId] = meGustas.some(mg => mg.idUser === idUsuario);
      });
      
      setUserLikes(likesTemp);
    } catch (error) {
      console.error("Error cargando likes del usuario:", error);
    }
  };
  
  // Reemplazar la función usuarioHaDadoLike existente
  const usuarioHaDadoLike = (idPublicacion) => {
    return userLikes[idPublicacion] || false;
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
                <button type='button' onClick={() => handleMeGustaPublicacion(publicacion.idPublicaciones)} style={{ fontSize: "2vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", height:"3vh", border: "none", backgroundColor:"#2c2c2c" }}> {usuarioHaDadoLike(publicacion.idPublicaciones) ? <HandThumbUpIcon style={{ width: "2vh", height: "2vh" }} /> : <NoMeGustaIcono style={{ width: "2vh", height: "2vh" }} />} </button>
                <p style={{marginLeft:"1vw", fontSize:"1.5vh"}}>{publicacion.numeroComentarios}</p>
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