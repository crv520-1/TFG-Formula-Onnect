import { HandThumbUpIcon as NoMeGustaIcono } from "@heroicons/react/24/outline";
import { ChatBubbleOvalLeftIcon, HandThumbUpIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";
import "../styles/Botones.css";
import "../styles/Containers.css";
import "../styles/Imagenes.css";
import "../styles/Textos.css";
import HeaderPerfil from "./HeaderPerfil";
import { carga } from "./animacionCargando";

/**
 * Componente que muestra las publicaciones de un usuario específico
 * Permite ver e interactuar con las publicaciones desde el perfil del usuario
 */
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

  /**
   * Función para obtener los datos del usuario desde el backend
   * @param {number} idUser - ID del usuario a consultar
   * @returns {Object} Datos del usuario
   */
  const fetchUsuario = async (idUser) => {
    const response = await axios.get("http://localhost:3000/api/usuarios");
    const usuario = response.data.find(user => user.idUsuario === idUser);
    if (!usuario) throw new Error("Usuario no encontrado");
    return usuario;
  };

  /**
   * Función para obtener las publicaciones de un usuario
   * @param {number} idUser - ID del usuario a consultar
   * @returns {Array} Lista de publicaciones
   */
  const fetchPublicaciones = async (idUser) => {
    const response = await axios.get(`http://localhost:3000/api/publicaciones/${idUser}`);
    return response.data || [];
  };

  /**
   * Función para obtener estadísticas del usuario (publicaciones, seguidores, seguidos)
   * @param {number} idUser - ID del usuario a consultar
   * @returns {Object} Objeto con estadísticas del usuario
   */
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

  /**
   * Función para obtener interacciones (me gustas y comentarios) de las publicaciones
   * @param {Array} publicaciones - Lista de publicaciones
   * @returns {Object} Objeto con comentarios y me gustas
   */
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

  /**
   * Función para determinar qué publicaciones tienen me gusta del usuario actual
   * @param {Array} publicaciones - Lista de publicaciones
   * @returns {Object} Mapa de IDs de publicación a booleanos de me gusta
   */
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

  /**
   * Función principal que carga todos los datos necesarios para la vista
   */
  const cargarTodo = async () => {
    setCargando(true);
    try {
      // Verificar relación entre usuario actual y perfil visitado
      const { mismoUsuario, sigo } = await verificarSeguimiento(idUser, idUsuario);
      setMismoUsuario(mismoUsuario);
      setSigo(sigo);

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
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      // Pequeño delay para mostrar la animación de carga
      setTimeout(() => { setCargando(false); }, 500);
    }
  };

  /**
   * Función para verificar relación entre usuarios
   * Determina si es el mismo usuario o si el usuario actual sigue al visualizado
   * @param {number} idUser - ID del usuario visualizado
   * @param {number} idUsuario - ID del usuario actual
   * @returns {Object} Estado de la relación entre usuarios
   */
    const verificarSeguimiento = async (idUser, idUsuario) => {
      if (idUser === idUsuario) {
        return { mismoUsuario: true, sigo: false };
      }
    
      try {
        const sigoResponse = await axios.get(`http://localhost:3000/api/seguidores/${idUsuario}/${idUser}`);
        return { mismoUsuario: false, sigo: sigoResponse.data };
      } catch (error) {
        console.error("Error obteniendo si sigo al usuario:", error);
        return { mismoUsuario: false, sigo: false };
      }
    };

  // Cargar todos los datos cuando cambia el usuario o el perfil visitado
  useEffect(() => {
    cargarTodo();
  }, [idUsuario, idUser]);

  /**
   * Función para navegar a la vista de datos del perfil
   */
  const handleDatos = (e) => {
    e.preventDefault();
    navigate("/Perfil", { state: { idUser: idUser } });
  };

  /**
   * Función para dar o quitar me gusta a una publicación
   * @param {number} idPublicacion - ID de la publicación
   */
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

  /**
   * Función para navegar a la vista de comentarios de una publicación
   * @param {number} idPublicacion - ID de la publicación
   */
  const handleComentarios = (idPublicacion) => {
    navigate(`/Comentarios`, { state: { idElemento: idPublicacion, previusPath: 1 } });
  };
  
  // Muestra animación de carga mientras se obtienen los datos
  if (cargando) { return carga(); }

  /**
   * Función para obtener el número de me gustas de una publicación
   * @param {number} idPublicacion - ID de la publicación
   * @returns {number} Número de me gustas
   */
  const obtenerContadorMeGusta = (idPublicacion) => {
    const meGusta = meGustasPublicaciones.find(mg => mg.idElemento === idPublicacion);
    return meGusta ? meGusta.contador : 0;
  };

  /**
   * Función para obtener el número de comentarios de una publicación
   * @param {number} idPublicacion - ID de la publicación
   * @returns {number} Número de comentarios
   */
  const obtenerContadorComentarios = (idPublicacion) => {
    const comentarios = comentariosPublicaciones.find(comentario => comentario.post === idPublicacion);
    return comentarios ? comentarios.contador : 0;
  };

  /**
   * Función para actualizar el estado cuando cambia el número de seguidores
   * @param {number} nuevoNumeroSeguidores - Nuevo número de seguidores
   * @param {boolean} nuevoEstadoSigo - Nuevo estado de seguimiento
   */
  const handleSeguidoresChange = (nuevoNumeroSeguidores, nuevoEstadoSigo) => {
    setSeguidores(nuevoNumeroSeguidores);
    setSigo(nuevoEstadoSigo);
  };

  /**
   * Función para verificar si el usuario actual ha dado me gusta a una publicación
   * @param {number} idPublicacion - ID de la publicación
   * @returns {boolean} True si el usuario ha dado me gusta
   */
  const usuarioHaDadoLike = (idPublicacion) => {
    return userLikes[idPublicacion] || false;
  };

  return (
    <div className="container_overflow">
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
      <div className="container_columna">
        <div className="container_fila_paddingTop_v4">
          <button type='submit' onClick={handleDatos} className="boton_fondo_15_v3">Datos</button>
          <h2 className="titulo_c4">Publicaciones</h2>
        </div>
      </div>
      <div className="container_overflow_padding">
        {publicaciones.map((publicacion) => (
          <div key={publicacion.idPublicaciones} className="container_columna_2c_v3">
            <div className="container_fila_padding_v2">
              <img src={usuario.fotoPerfil} className="imagen_perfil"/>
              <p className="datos">{usuario.nickName}</p>
              <p className="datos">{new Date(publicacion.fechaPublicacion).toLocaleDateString()}</p>
              <div className="container_auto_centro">
                <p className="datos">{obtenerContadorMeGusta(publicacion.idPublicaciones)}</p>
                <button type='button' onClick={() => handleMeGusta(publicacion.idPublicaciones)} className="boton_fondo_2c_v4"> 
                  {usuarioHaDadoLike(publicacion.idPublicaciones) ? <HandThumbUpIcon className="icono"/> : <NoMeGustaIcono className="icono"/>} 
                </button>
                <p className="datos">{obtenerContadorComentarios(publicacion.idPublicaciones)}</p>
                <button type='button' onClick={() => handleComentarios(publicacion.idPublicaciones)} className="boton_fondo_2c_v4">
                  <ChatBubbleOvalLeftIcon className="icono"/>
                </button>
              </div>
            </div>
            <button className="boton_fondo_2c_v3" onClick={() => handleComentarios(publicacion.idPublicaciones)}>
              {publicacion.texto}
            </button>
          </div>
        ))}
      </div>
      <br/>
    </div>
  );
};

export default PerfilPublicaciones;