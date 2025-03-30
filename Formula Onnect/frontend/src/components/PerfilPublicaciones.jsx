import { HandThumbUpIcon as NoMeGustaIcono } from "@heroicons/react/24/outline";
import { ChatBubbleOvalLeftIcon, HandThumbUpIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";
import HeaderPerfil from "./HeaderPerfil";
import { carga } from "./animacionCargando";

export const PerfilPublicaciones = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { idUser } = location.state || {};
  const { user: idUsuario } = useContext(UsuarioContext);
  const [usuario, setUsuario] = useState({});
  const [userLikes, setUserLikes] = useState({});
  const [publicaciones, setPublicaciones] = useState([]);
  const [meGustasPublicaciones, setMeGustasPublicaciones] = useState([]);
  const [comentariosPublicaciones, setComentariosPublicaciones] = useState([]);
  const [seguidores, setSeguidores] = useState(0);
  const [siguiendo, setSiguiendo] = useState(0);
  const [numeroPublicaciones, setNumeroPublicaciones] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [sigo, setSigo] = useState(false);
  const [mismoUsuario, setMismoUsuario] = useState(false);

  // Separar las llamadas API en funciones más pequeñas
  const fetchUsuario = async (idUser) => {
    const response = await axios.get("http://localhost:3000/api/usuarios");
    const usuario = response.data.find(user => user.idUsuario === idUser);
    if (!usuario) throw new Error("Usuario no encontrado");
    return usuario;
  };

  const fetchPublicaciones = async (idUser) => {
    const response = await axios.get(`http://localhost:3000/api/publicaciones/${idUser}`);
    return response.data || [];
  };

  const fetchEstadisticas = async (idUser) => {
    const [numeroPublicaciones, seguidores, siguiendo] = await Promise.all([
      axios.get(`http://localhost:3000/api/publicaciones/count/${idUser}`),
      axios.get(`http://localhost:3000/api/seguidores/seguidores/${idUser}`),
      axios.get(`http://localhost:3000/api/seguidores/siguiendo/${idUser}`)
    ]);

    return {
      publicaciones: numeroPublicaciones.data["COUNT(*)"] || 0,
      seguidores: seguidores.data["COUNT(*)"] || 0,
      siguiendo: siguiendo.data["COUNT(*)"] || 0
    };
  };

  const fetchInteracciones = async (publicaciones) => {
    if (!publicaciones.length) return { comentarios: [], meGustas: [] };

    const idsPublicaciones = publicaciones.map(pub => pub.idPublicaciones);
    
    const [comentariosResults, meGustasResults] = await Promise.all([
      Promise.all(idsPublicaciones.map(id => 
        axios.get(`http://localhost:3000/api/comentarios/numero/${id}`)
      )),
      Promise.all(idsPublicaciones.map(id => 
        axios.get(`http://localhost:3000/api/meGusta/${id}`)
      ))
    ]);

    return {
      comentarios: comentariosResults.flatMap(response => response.data || []),
      meGustas: meGustasResults.flatMap(response => response.data || [])
    };
  };

  const fetchUserLikes = async (publicaciones) => {
    if (!publicaciones.length) return {};
    
    try {
      const response = await axios.get(`http://localhost:3000/api/meGusta`);
      const meGustas = response.data || [];
      
      // Crear un objeto con los me gustas del usuario actual
      const likes = {};
      publicaciones.forEach(pub => {
        likes[pub.idPublicaciones] = meGustas.some(
          mg => mg.idElemento === pub.idPublicaciones && mg.idUser === idUsuario
        );
      });
      return likes;
    } catch (error) {
      console.error("Error obteniendo me gustas del usuario:", error);
      return {};
    }
  };

  // Función para cargar todos los datos
  const cargarTodo = async () => {
    setCargando(true);
    try {
      const usuario = await fetchUsuario(idUser);
      setUsuario(usuario);

      const publicaciones = await fetchPublicaciones(idUser);
      setPublicaciones(publicaciones);

      const estadisticas = await fetchEstadisticas(idUser);
      setNumeroPublicaciones(estadisticas.publicaciones);
      setSeguidores(estadisticas.seguidores);
      setSiguiendo(estadisticas.siguiendo);

      const interacciones = await fetchInteracciones(publicaciones);
      setComentariosPublicaciones(interacciones.comentarios);
      setMeGustasPublicaciones(interacciones.meGustas);

      // Cargar los me gustas del usuario actual
      const likes = await fetchUserLikes(publicaciones);
      setUserLikes(likes);

      // Comprobar si es el mismo usuario o si lo sigue
      if (idUser !== idUsuario) {
        setMismoUsuario(false);
        const sigoResponse = await axios.get(`http://localhost:3000/api/seguidores/${idUsuario}/${idUser}`);
        setSigo(sigoResponse.data);
      } else {
        setMismoUsuario(true);
        setSigo(false);
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setTimeout(() => {
        setCargando(false);
      }, 500);
    }
  };

  // Un solo useEffect para manejar toda la carga de datos
  useEffect(() => {
    cargarTodo();
  }, [idUsuario, idUser]);

  const handleDatos = (e) => {
    e.preventDefault();
    navigate("/Perfil", { state: { idUser: idUser } });
  };

  const handleMeGusta = async (idPublicacion) => {
    try {
      const meGustasResponse = await axios.get(`http://localhost:3000/api/meGusta`);
      const meGustas = meGustasResponse.data || [];
      
      // Verificar si ya dio me gusta
      const yaDioMeGusta = meGustas.some(
        meGusta => meGusta.idElemento === idPublicacion && meGusta.idUser === idUsuario
      );
      
      if (yaDioMeGusta) {
        await axios.delete(`http://localhost:3000/api/meGusta/${idUsuario}/${idPublicacion}`);
      } else {
        const nuevoMeGusta = {
          idUser: idUsuario,
          idElemento: idPublicacion
        };
        await axios.post("http://localhost:3000/api/meGusta", nuevoMeGusta);
      }

      // Actualizar el estado local inmediatamente
      setUserLikes(prevLikes => ({
        ...prevLikes,
        [idPublicacion]: !yaDioMeGusta
      }));

      // Recargar solo los me gustas y comentarios
      const interacciones = await fetchInteracciones(publicaciones);
      setComentariosPublicaciones(interacciones.comentarios);
      setMeGustasPublicaciones(interacciones.meGustas);
    } catch (error) {
      console.error("Error al dar me gusta:", error);
    }
  };

  const handleComentarios = (idPublicacion) => {
    // Pasar el ID de la publicación como parámetro para la vista de comentarios
    navigate(`/Comentarios`, { state: { idElemento: idPublicacion, previusPath: 1 } });
  };
  
  if (cargando) { return carga(); }

  // Función para obtener el contador de me gustas para una publicación específica
  const obtenerContadorMeGusta = (idPublicacion) => {
    const meGusta = meGustasPublicaciones.find(mg => mg.idElemento === idPublicacion);
    return meGusta ? meGusta.contador : 0;
  };

  const obtenerContadorComentarios = (idPublicacion) => {
    const comentarios = comentariosPublicaciones.find(comentario => comentario.post === idPublicacion);
    return comentarios ? comentarios.contador : 0;
  };

  const handleSeguidoresChange = (nuevoNumeroSeguidores, nuevoEstadoSigo) => {
    setSeguidores(nuevoNumeroSeguidores);
    setSigo(nuevoEstadoSigo);
  };
  const usuarioHaDadoLike = (idPublicacion) => {
    return userLikes[idPublicacion] || false;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", maxHeight: "98vh", overflow: "auto", overflowX: "hidden" }}>
      <HeaderPerfil
        usuario={usuario}
        numeroPublicaciones={numeroPublicaciones}
        seguidores={seguidores}
        siguiendo={siguiendo}
        sigo={sigo}
        idUser={idUsuario}
        onSeguidoresChange={handleSeguidoresChange}
        mismoUsuario={mismoUsuario}
      />
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }} >
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} >
          <button type='submit' onClick={handleDatos} style={{ fontSize: "2vh", height:"3vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border:"none", backgroundColor:"#15151E" }}>Datos</button>
          <h2 style={{ backgroundColor: "#C40000", borderRadius:"0.5vh", width: "15vh", fontSize:"2vh", textAlign: "center", marginLeft: "35vh" }}>Publicaciones</h2>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", maxHeight: "100%", overflow: "auto", paddingRight:"2vh", overflowX: "hidden" }}>
        {publicaciones.map((publicacion) => (
          <div key={publicacion.idPublicaciones} style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor:"#2c2c2c", width:"50vw", height:"auto", borderRadius:"1vh", marginBottom: "2vh" }}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", paddingTop:"1vh", width: "95%", paddingLeft: "1vh", paddingRight: "1vh" }}>
              <img src={usuario.fotoPerfil} style={{ width: "3vh", height: "3vh", borderRadius: "50%", backgroundColor:"white" }} />
              <p style={{marginLeft:"1vw", fontSize:"1.5vh"}}>{usuario.nickName}</p>
              <p style={{marginLeft:"2vw", fontSize:"1.5vh"}}>{new Date(publicacion.fechaPublicacion).toLocaleDateString()}</p>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
                <p style={{fontSize:"1.5vh"}}>{obtenerContadorMeGusta(publicacion.idPublicaciones)}</p>
                <button type='button' onClick={() => handleMeGusta(publicacion.idPublicaciones)} style={{ fontSize: "2vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", height:"3vh", border: "none", backgroundColor:"#2c2c2c" }}> {usuarioHaDadoLike(publicacion.idPublicaciones) ? <HandThumbUpIcon style={{ width: "2vh", height: "2vh" }} /> : <NoMeGustaIcono style={{ width: "2vh", height: "2vh" }} />} </button>
                <p style={{marginLeft:"1vw", fontSize:"1.5vh"}}>{obtenerContadorComentarios(publicacion.idPublicaciones)}</p>
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

export default PerfilPublicaciones;