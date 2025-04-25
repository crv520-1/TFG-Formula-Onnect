import { HandThumbUpIcon as NoMeGustaIcono } from "@heroicons/react/24/outline";
import { ChatBubbleOvalLeftIcon, HandThumbUpIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";
import "../styles/Containers.css";
import "../styles/Textos.css";
import { carga } from './animacionCargando';

/**
 * Componente que muestra un hilo de comentarios de un comentario específico
 * Permite ver, comentar y dar me gusta tanto al comentario padre como a sus respuestas
 */
export const HiloComentarios = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { idComentario, idElemento, previusPath } = location.state || {};
  const { user: idUsuario } = useContext(UsuarioContext);
  
  // Estados para almacenar datos del comentario padre, respuestas y usuarios
  const [comentarioPadre, setComentarioPadre] = useState({});
  const [respuestas, setRespuestas] = useState([]);
  const [usuarioComentarioPadre, setUsuarioComentarioPadre] = useState({});
  const [usuarioComentador, setUsuarioComentador] = useState({});
  const [meGustasComentarioPadre, setMeGustasComentarioPadre] = useState({});
  const [numeroRespuestas, setNumeroRespuestas] = useState({});
  const [userLikesRespuestas, setUserLikesRespuestas] = useState({});
  const [texto, setTexto] = useState("");
  const [hayRespuestas, setHayRespuestas] = useState(false);
  const [userLikeComentarioPadre, setUserLikeComentarioPadre] = useState(false);
  const [cargando, setCargando] = useState(true);
  
  // Constantes para controlar límites de texto
  const maxCaracteres = 450;
  const advertenciaCaracteres = 400;

  // Actualizamos solo al cambiar de comentario
  useEffect(() => {
    /**
     * Función que carga todos los datos necesarios para la vista de hilo de comentarios
     */
    const cargarDatos = async () => {
      setCargando(true);
      if (!idComentario) {
        console.error("No se ha proporcionado un ID de comentario");
        return;
      }
      // Llamamos a los métodos para obtener todos los datos necesarios en la interfaz.
      try {
        const [usuarioComentadorData, comentarioPadreData, respuestasData] = await Promise.all([
          cargarUsuarioComentador(),
          cargarComentarioPadre(),
          cargarRespuestas()
        ]);
        
        if (usuarioComentadorData) setUsuarioComentador(usuarioComentadorData);
        if (comentarioPadreData) {
          setComentarioPadre(comentarioPadreData);
          cargarUsuarioComentarioPadre(comentarioPadreData.user);
          cargarMeGustasComentarioPadre(comentarioPadreData.idComentarios);
          cargarNumeroRespuestas(comentarioPadreData.idComentarios);
        }
        if (respuestasData) setRespuestas(respuestasData);
      }
      catch (error) {
        console.error("Error al cargar los datos:", error);
      }
      // Pequeño delay para mostrar la animación de carga
      setTimeout(() => { setCargando(false); }, 500);
    };
    cargarDatos();
  }, [idComentario]);

  /**
   * Función para cargar los datos del usuario que va a comentar
   * @returns {Object} Datos del usuario comentador
   */
  const cargarUsuarioComentador = async () => {
    try {
      const usuarioComentadorResponse = await axios.get(`http://localhost:3000/api/usuarios/${idUsuario}`);
      const usuarioComentadorData = usuarioComentadorResponse.data || {};

      if (!usuarioComentadorData) {
        console.error("No se encontró el usuario comentador");
        return;
      }
      // Actualizamos el estado con los datos del usuario comentador
      return usuarioComentadorData;
    } catch (error) {
      console.error("Error obteniendo usuario comentador:", error);
    }
  }

  /**
   * Función para cargar el comentario padre
   * @returns {Object} Datos del comentario padre
   */
  const cargarComentarioPadre = async () => {
    try {
      const comentarioPadreResponse = await axios.get(`http://localhost:3000/api/comentarios/${idComentario}`);
      const comentarioPadreData = comentarioPadreResponse.data || {};

      if (!comentarioPadreData) {
        console.error("No se encontró el comentario padre");
        return;
      }
      // Actualizamos el estado con los datos del comentario padre
      return comentarioPadreData;
    } catch (error) {
      console.error("Error obteniendo comentario padre:", error);
      return null;
    }
  }

  /**
   * Función para cargar todas las respuestas a un comentario
   * Obtiene datos adicionales como usuarios y me gustas para cada respuesta
   * @returns {Array} Lista de respuestas con datos completos
   */
  const cargarRespuestas = async () => {
    try {
      const respuestasResponse = await axios.get(`http://localhost:3000/api/comentarios/publicacion/${idElemento}`);
      const respuestasEncontradas = respuestasResponse.data || [];
      
      // Si no hay respuestas, actualizar el estado y retornar
      if (respuestasEncontradas.length === 0) {
        setRespuestas([]);
        setHayRespuestas(false);
        return [];
      }
      
      // Obtener todos los usuarios para mapearlos a las respuestas
      const usuariosComentadores = await axios.get(`http://localhost:3000/api/usuarios`);
      const usuariosComentadoresData = usuariosComentadores.data || {};
  
      // Crear un mapa de usuarios para acceso rápido por ID
      const mapaUsuariosComentadores = {};
      usuariosComentadoresData.forEach(user => {
        mapaUsuariosComentadores[user.idUsuario] = user;
      });
  
      // Obtener todos los me gustas de comentarios
      const meGustasComentarioResponse = await axios.get(`http://localhost:3000/api/meGustaComentarios`);
      const todosLosMeGustas = meGustasComentarioResponse.data || [];
  
      // Procesar cada respuesta para añadir datos adicionales
      const promesasRespuestas = respuestasEncontradas.map(async respuesta => {
        const usuarioComentador = mapaUsuariosComentadores[respuesta.user];
        const meGustasRespuestaResponse = await axios.get(`http://localhost:3000/api/meGustaComentarios/numero/${respuesta.idComentarios}`);
        const meGustasRespuesta = meGustasRespuestaResponse.data || [];
        const contadorMeGustas = meGustasRespuesta.length > 0 ? meGustasRespuesta[0].contador : 0;
        
        // Verificar si el usuario actual ha dado me gusta a la respuesta
        const userHasLiked = todosLosMeGustas.some(mg => 
          mg.idComent === respuesta.idComentarios && mg.iDusuario === idUsuario
        );

        const contadorRespuestasHijoResponse = await axios.get(`http://localhost:3000/api/comentarios/numeroComentarioPadre/${respuesta.idComentarios}`);
        const contadorRespuestasHijoData = contadorRespuestasHijoResponse.data || [];
        const contadorRespuestasHijo = contadorRespuestasHijoData.contador || 0;
  
        return {
          ...respuesta,
          usuarioComentador: usuarioComentador || null,
          meGustaComentario: contadorMeGustas,
          userHasLiked,
          contadorRespuestasHijo
        };
      });
  
      const respuestasCompletas = await Promise.all(promesasRespuestas);

      const respuestasPadre = respuestasCompletas.filter(c => c.comentarioPadre === idComentario);
      const respuestasHijos = respuestasCompletas.filter(c => c.comentarioPadre !== idComentario);
      
      const mapaRespuestasHijosPorPadre = {};
      respuestasHijos.forEach(hijo => {
        if (!mapaRespuestasHijosPorPadre[hijo.comentarioPadre]) {
          mapaRespuestasHijosPorPadre[hijo.comentarioPadre] = [];
        }
        mapaRespuestasHijosPorPadre[hijo.comentarioPadre].push(hijo);
      });
      
      const respuestasOrdenados = [];
      respuestasPadre.forEach(padre => {
        respuestasOrdenados.push(padre);
        
        const hijos = mapaRespuestasHijosPorPadre[padre.idComentarios] || [];
        respuestasOrdenados.push(...hijos);
      });
      
      // Actualizar el estado de likes
      const likesTemp = {};
      respuestasOrdenados.forEach(respuesta => {
        likesTemp[respuesta.idComentarios] = respuesta.userHasLiked;
      });
      
      setUserLikesRespuestas(likesTemp);
      setRespuestas(respuestasOrdenados);
      setHayRespuestas(true);
      
      return respuestasOrdenados;
    } catch (error) {
      console.error("Error obteniendo respuestas:", error);
      return [];
    }
  };

  /**
   * Función para cargar los datos del usuario que ha escrito el comentario padre
   * @param {number} idUsuarioComentarioPadre - ID del usuario que creó el comentario padre
   */
  const cargarUsuarioComentarioPadre = async (idUsuarioComentarioPadre) => {
    try {
      const usuarioComentarioPadreResponse = await axios.get(`http://localhost:3000/api/usuarios/${idUsuarioComentarioPadre}`);
      const usuarioComentarioPadreData = usuarioComentarioPadreResponse.data || {};
      
      if (!usuarioComentarioPadreData) {
        console.error("No se encontró el usuario del comentario padre");
        return;
      }
      setUsuarioComentarioPadre(usuarioComentarioPadreData);
    } catch (error) {
      console.error("Error obteniendo usuario del comentario padre:", error);
    }
  }

  /**
   * Método para obtener la cantidad de me gustas de un comentario padre
   * También verifica si el usuario actual ha dado me gusta
   * @param {number} idComent - ID del comentario padre
   */
  const cargarMeGustasComentarioPadre = async (idComent) => {
    try {
      const meGustaResponse = await axios.get(`http://localhost:3000/api/meGustaComentarios/numero/${idComent}`);
      const meGusta = meGustaResponse.data || [];
      
      // Obtener todos los me gustas para verificar si el usuario actual dio like
      const meGustasComentarioResponse = await axios.get(`http://localhost:3000/api/meGustaComentarios`);
      const todosLosMeGustas = meGustasComentarioResponse.data || [];
      
      // Verificar si el usuario actual ha dado like
      const hasLiked = todosLosMeGustas.some(mg => 
        mg.idComent === idComent && mg.iDusuario === idUsuario
      );
      
      setUserLikeComentarioPadre(hasLiked);
      setMeGustasComentarioPadre(meGusta);
    } catch (error) {
      console.error("Error obteniendo me gustas del comentario padre:", error);
    }
  }

  /**
   * Método para obtener la cantidad de respuestas de un comentario padre
   * @param {number} idComentPadre - ID del comentario padre
   */
  const cargarNumeroRespuestas = async (idComentPadre) => {
    try {
      const numeroRespuestasResponse = await axios.get(`http://localhost:3000/api/comentarios/numeroComentarioPadre/${idComentPadre}`);
      const numeroRespuestasData = numeroRespuestasResponse.data || {};

      setNumeroRespuestas(numeroRespuestasData);
    } catch (error) {
      console.error("Error obteniendo número de respuestas:", error);
    }
  }

  /**
   * Método para navegar a la vista de comentarios de la publicación
   */
  const handleVolverComentarios = () => {
    // Comprobar si el comentario padre tiene predecesor
    if (comentarioPadre.comentarioPadre) {
      // Si tiene, navegar a la vista de hilo de comentarios
      navigate("/HiloComentarios", { state: { idComentario: comentarioPadre.comentarioPadre, idElemento, previusPath } });
    } else {
      // Si no tiene, navegar a la vista de comentarios
      navigate("/Comentarios", { state: { idElemento, previusPath } });
    }
  }

  /**
   * Método para dar o eliminar me gusta a un comentario padre
   * Actualiza el estado local y recarga los datos
   * @param {number} idComent - ID del comentario padre
   */
  const handleMeGustaComentarioPadre = async (idComent) => {
    try {
      const meGustasComentarioResponse = await axios.get(`http://localhost:3000/api/meGustaComentarios`);
      const meGustasComentario = meGustasComentarioResponse.data || [];
  
      const hasLiked = meGustasComentario.some(
        meGustaComent => 
          meGustaComent.idComent === idComent && 
          meGustaComent.iDusuario === idUsuario
      );
  
      if (hasLiked) {
        await axios.delete(`http://localhost:3000/api/meGustaComentarios/${idUsuario}/${idComent}`);
      } else {
        const nuevoMeGusta = {
          iDusuario: idUsuario,
          idComent: idComent
        };
        await axios.post("http://localhost:3000/api/meGustaComentarios", nuevoMeGusta);
      }
      
      // Actualizar el estado local inmediatamente
      setUserLikeComentarioPadre(prev => !prev);
      
      // Actualizar el contador localmente para feedback inmediato
      setMeGustasComentarioPadre(prevState => {
        if (!prevState || !prevState[0]) return [{ contador: userLikeComentarioPadre ? 0 : 1 }];
        
        const newCount = userLikeComentarioPadre 
          ? Math.max(0, prevState[0].contador - 1) 
          : prevState[0].contador + 1;
          
        return [{ ...prevState[0], contador: newCount }];
      });
      
      // Agregar un pequeño retraso antes de recargar los datos del servidor
      setTimeout(async () => {
        await cargarMeGustasComentarioPadre(idComent);
      }, 300);
    } catch (error) {
      console.error("Error al dar me gusta al comentario padre:", error);
    }
  }

  /**
   * Método para dar o eliminar me gusta a una respuesta
   * Gestiona la adición o eliminación del me gusta en la base de datos
   * @param {number} idRespuesta - ID de la respuesta
   */
  const handleMeGustaRespuesta = async (idRespuesta) => {
    try {
      const meGustasComentarioResponse = await axios.get(`http://localhost:3000/api/meGustaComentarios`);
      const meGustasComentario = meGustasComentarioResponse.data || [];
  
      const hasLiked = meGustasComentario.some(
        meGustaComentario => 
          meGustaComentario.idComent === idRespuesta && 
          meGustaComentario.iDusuario === idUsuario
      );
  
      if (hasLiked) {
        await axios.delete(`http://localhost:3000/api/meGustaComentarios/${idUsuario}/${idRespuesta}`);
      } else {
        const nuevoMeGusta = {
          iDusuario: idUsuario,
          idComent: idRespuesta
        };
        await axios.post("http://localhost:3000/api/meGustaComentarios", nuevoMeGusta);
      }
  
      // Actualizar el estado local inmediatamente
      setUserLikesRespuestas(prev => ({
        ...prev,
        [idRespuesta]: !prev[idRespuesta]
      }));
  
      // Actualizar las respuestas para refrescar el contador
      await cargarRespuestas();
    } catch (error) {
      console.error("Error al dar me gusta:", error);
    }
  };

  /**
   * Método para navegar al perfil de un usuario
   * @param {number} idUser - ID del usuario a visualizar
   */
  const handleVisualizarPerfil = (idUser) => {
    navigate("/Perfil", { state: { idUser } });
  }

  /**
   * Método para publicar una nueva respuesta a un comentario
   * Valida el texto y realiza la petición al servidor
   * @param {Event} e - Evento del formulario
   */
  const handlePublicar = async (e) => {
    e.preventDefault();
    if (texto.length === 0) {
      alert("Tienes que introducir texto para poder publicar");
      return;
    }
    
    try {
      setCargando(true);
      const nuevaRespuesta = {
        text: texto,
        user: idUsuario,
        post: idElemento,
        comentarioPadre: idComentario
      };
      
      await axios.post("http://localhost:3000/api/comentarios", nuevaRespuesta);
      setTexto("");

      await new Promise(resolve => setTimeout(resolve, 300)); // Esperar un poco para la animación de carga
      
      // Recargar todos los datos necesarios
      await Promise.all([
        cargarNumeroRespuestas(idComentario),
        cargarRespuestas()
      ]);
      
      setHayRespuestas(true);
      setCargando(false);
    } catch (error) {
      console.error("Error al publicar respuesta:", error);
      setCargando(false);
    }
  };

  /**
   * Método para navegar a las respuestas de una respuesta
   * @param {number} idRespuesta - ID de la respuesta que queremos ver sus respuestas
   */
  const handleRespuestas = async (idRespuesta) => {
    navigate("/HiloComentarios", { state: { idComentario: idRespuesta, idElemento: idElemento, previusPath: previusPath } });
  }

  // Color del contador de caracteres basado en la longitud del texto
  const colorContador = texto.length === maxCaracteres ? "red" : texto.length >= advertenciaCaracteres ? "orange" : "white";

  // Muestra animación de carga mientras se procesan los datos
  if (cargando) { return (carga()) }

  return (
    <div className="container_overflow">
      <div className="container_fila_paddingBottom">
        <button type='submit' onClick={handleVolverComentarios} className="boton_fondo_15_v3">Comentarios</button>
        <h2 className="titulo_c4">Respuestas</h2>
      </div>
      <div className="container_columna_2c_v5">
        <div className="container_fila_padding">
          {usuarioComentarioPadre && (
            <div className="container_fila_noJustify_v2">
              <button onClick={() => {handleVisualizarPerfil(usuarioComentarioPadre.idUsuario)}} className="boton_fondo_2c_v2">
                <img src={usuarioComentarioPadre.fotoPerfil} alt="Foto de perfil" className="imagen_perfil"/>
                <h3 className="titulo_f">{usuarioComentarioPadre.nickName}</h3>
              </button>
              <p className="datos_v2">{new Date(comentarioPadre.fechaComentario || Date.now()).toLocaleDateString()}</p>
              {meGustasComentarioPadre && (
              <div className="container_marginLeft">
                <p className="datos">{meGustasComentarioPadre[0]?.contador || 0}</p>
                <button type='button' onClick={() => handleMeGustaComentarioPadre(comentarioPadre.idComentarios)} className="boton_fondo_2c_v4"> 
                  {userLikeComentarioPadre ? <HandThumbUpIcon className="icono"/> : <NoMeGustaIcono className="icono"/>} 
                </button>
                <p className="datos">{numeroRespuestas?.contador || 0}</p>
                <button type='button' className="boton_fondo_2c_v4"><ChatBubbleOvalLeftIcon className="icono"/></button>
              </div>
              )}
            </div>
          )}
        </div>
        <p className="datos_2c">{comentarioPadre.text}</p>
        <hr className="linea_separadora"/>
        <div className="container_2c">
          <div className="container_fila_noJustify">
            <img src={usuarioComentador.fotoPerfil} alt="Foto de perfil" className="imagen_perfil"/>
            <h3 className="titulo_f">{usuarioComentador.nickName}</h3>
          </div>
          <div className="container_columna_v2">
            <div className="container_fila_noJustify_v2">
              <textarea className="textarea" placeholder="Escribe una respuesta..." maxLength={450} onChange={(e) => setTexto(e.target.value)} value={texto}></textarea>
              <button type='submit' onClick={handlePublicar} className="boton_fondo_2c_v5"><PaperAirplaneIcon className="icono_v2"/></button>
            </div>
            <p style={{ color:colorContador, fontSize: "1.75vh", transition: "color 0.5s" }}> {texto.length}/{maxCaracteres} caracteres </p>
          </div>
        </div>
      </div>
      <br/>
      <div className="container_overflow_padding">
        {hayRespuestas && respuestas.map((respuesta) => (
          <div key={respuesta.idComentarios} className="container_2c">
            <div className="container_columna_100">
              <div className="container_fila_spaceBetween_v2">
                {respuesta.usuarioComentador && (
                  <button onClick={() => {handleVisualizarPerfil(respuesta.usuarioComentador.idUsuario)}} className="boton_fondo_2c_v6">
                    <img src={respuesta.usuarioComentador.fotoPerfil} alt="Foto de perfil" className="imagen_perfil" />
                    <h3 className="titulo_f">{respuesta.usuarioComentador.nickName}</h3>
                  </button>
                )}
                <div className="container_gap">
                  <p className="datos">{respuesta.meGustaComentario}</p>
                  <button type='button' onClick={() => handleMeGustaRespuesta(respuesta.idComentarios)} className="boton_fondo_2c_v4"> 
                    {userLikesRespuestas[respuesta.idComentarios] ? <HandThumbUpIcon className="icono"/> : <NoMeGustaIcono className="icono"/>} 
                  </button>
                  <p className="datos">{respuesta.contadorRespuestasHijo}</p>
                  <button type='button' onClick={() => handleRespuestas(respuesta.idComentarios)} className="boton_fondo_2c_v4">
                    <ChatBubbleOvalLeftIcon className="icono"/>
                  </button>
                </div>
              </div>
              <button className="boton_fondo_2c_v3" onClick={() => handleRespuestas(respuesta.idComentarios)}>
                {respuesta.text}
              </button>
            </div>
          </div> 
        ))}
      </div>
      <br/>
    </div>
  )
}

export default HiloComentarios;