import { HandThumbUpIcon as NoMeGustaIcono } from "@heroicons/react/24/outline";
import { ChatBubbleOvalLeftIcon, HandThumbUpIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";
import { useMeGusta } from '../hooks/useMeGusta';
import "../styles/Containers.css";
import "../styles/Textos.css";
import { carga } from './animacionCargando';

/**
 * Componente que muestra los comentarios de una publicación específica
 * Permite ver, comentar y dar me gusta tanto a la publicación como a sus comentarios
 */
export const Comentarios = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { idElemento, previusPath } = location.state || {};
  const { user: idUsuario } = useContext(UsuarioContext);
  
  // Estados para almacenar datos de la publicación, comentarios y usuarios
  const [publicacion, setPublicacion] = useState({});
  const [comentarios, setComentarios] = useState({});
  const [usuarioPublicador, setUsuarioPublicador] = useState({});
  const [usuarioComentador, setUsuarioComentador] = useState({});
  const [meGustasPublicacion, setMeGustasPublicacion] = useState({});
  const [numeroComentarios, setNumeroComentarios] = useState({});
  const [userLikesComentarios, setUserLikesComentarios] = useState({});
  const [texto, setTexto] = useState("");
  const [hayComentarios, setHayComentarios] = useState(false);
  const [userLikePublicacion, setUserLikePublicacion] = useState(false);
  const [cargando, setCargando] = useState(true);
  const { handleMeGusta } = useMeGusta();
  
  // Constantes para controlar límites de texto
  const maxCaracteres = 450;
  const advertenciaCaracteres = 400;

  // Actualizamos solo al cambiar de publicación
  useEffect(() => {
    /**
     * Función que carga todos los datos necesarios para la vista de comentarios
     */
    const cargarDatos = async () => {
      setCargando(true);
      if (!idElemento) {
        console.error("No se ha proporcionado un ID de elemento");
        return;
      }
      // Llamamos a los métodos para obtener todos los datos necesarios en la interfaz.
      try {
        const [usuarioComentadorData, publicacionData, comentariosData] = await Promise.all([
          cargarUsuarioComentador(),
          cargarPublicacion(),
          cargarComentarios()
        ]);
        
        if (usuarioComentadorData) setUsuarioComentador(usuarioComentadorData);
        if (publicacionData) setPublicacion(publicacionData);
        if (comentariosData) setComentarios(comentariosData);
      }
      catch (error) {
        console.error("Error al cargar los datos:", error);
      }
      // Pequeño delay para mostrar la animación de carga
      setTimeout(() => { setCargando(false); }, 500);
    };
    cargarDatos();
  }, [idElemento]);

  /**
   * Función para cargar los datos del usuario que va a comentar la publicación
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
   * Función para cargar la publicación y los datos relacionados
   * Inicia la carga de usuario publicador, me gustas y comentarios
   * @returns {Object} Datos de la publicación
   */
  const cargarPublicacion = async () => {
    try {
      const publicacionResponse = await axios.get(`http://localhost:3000/api/publicaciones/publicacion/${idElemento}`);
      const publicacionEncontrada = publicacionResponse.data || {};
      
      if (!publicacionEncontrada) {
        console.error("No se encontró la publicación");
        return;
      }
      // Llamamos al método para obtener los datos del usuario que ha subido la publicación
      cargarUsuarioPublicador(publicacionEncontrada.usuario);
      // Llamamos al método para obtener la cantidad de me gustas de la publicación
      cargarMeGustasPublicacion(publicacionEncontrada.idPublicaciones);
      // Llamamos al método para obtener la cantidad de comentarios de la publicación
      cargarNumeroComentarios(publicacionEncontrada.idPublicaciones);
      // Actualizamos el estado con los datos de la publicación
      return publicacionEncontrada;
    } catch (error) {
      console.error("Error obteniendo publicación:", error);
    }
  }

  /**
   * Función para cargar todos los comentarios de una publicación
   * Obtiene datos adicionales como usuarios y me gustas para cada comentario
   * @returns {Array} Lista de comentarios con datos completos
   */
  const cargarComentarios = async () => {
    try {
      const comentariosResponse = await axios.get(`http://localhost:3000/api/comentarios/publicacion/${idElemento}`);
      const comentariosEncontrados = comentariosResponse.data || {};
      
      // Si no hay comentarios, actualizar el estado y retornar
      if (comentariosEncontrados.length === 0) {
        setComentarios([]);
        setHayComentarios(false);
        return [];
      }
      
      // Obtener todos los usuarios para mapearlos a los comentarios
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
  
      // Procesar cada comentario para añadir datos adicionales
      const promesasComentarios = comentariosEncontrados.map(async comentario => {
        const usuarioComentador = mapaUsuariosComentadores[comentario.user];
        const meGustasComentarioResponse = await axios.get(`http://localhost:3000/api/meGustaComentarios/numero/${comentario.idComentarios}`);
        const meGustasComentario = meGustasComentarioResponse.data || [];
        const contadorMeGustas = meGustasComentario.length > 0 ? meGustasComentario[0].contador : 0;
        
        // Verificar si el usuario actual ha dado me gusta al comentario
        const userHasLiked = todosLosMeGustas.some(mg => 
          mg.idComent === comentario.idComentarios && mg.iDusuario === idUsuario
        );
  
        return {
          ...comentario,
          usuarioComentador: usuarioComentador || null,
          meGustaComentario: contadorMeGustas,
          userHasLiked
        };
      });
  
      const comentariosCompletos = await Promise.all(promesasComentarios);
      
      // Actualizar el estado de likes
      const likesTemp = {};
      comentariosCompletos.forEach(comentario => {
        likesTemp[comentario.idComentarios] = comentario.userHasLiked;
      });
      
      setUserLikesComentarios(likesTemp);
      setComentarios(comentariosCompletos);
      setHayComentarios(true);
      
      return comentariosCompletos;
    } catch (error) {
      console.error("Error obteniendo comentarios:", error);
      return [];
    }
  };

  /**
   * Función para cargar los datos del usuario que ha publicado
   * @param {number} idUsuarioPublicador - ID del usuario que creó la publicación
   */
  const cargarUsuarioPublicador = async (idUsuarioPublicador) => {
    try {
      const usuarioPublicadorResponse = await axios.get(`http://localhost:3000/api/usuarios/${idUsuarioPublicador}`);
      const usuarioPublicadorData = usuarioPublicadorResponse.data || {};
      
      if (!usuarioPublicadorData) {
        console.error("No se encontró el usuario publicador");
        return;
      }
      setUsuarioPublicador(usuarioPublicadorData);
    } catch (error) {
      console.error("Error obteniendo usuario publicador:", error);
    }
  }

  /**
   * Método para obtener la cantidad de me gustas de una publicación
   * También verifica si el usuario actual ha dado me gusta
   * @param {number} idPublicacion - ID de la publicación
   */
  const cargarMeGustasPublicacion = async (idPublicacion) => {
    try {
      const meGustaResponse = await axios.get(`http://localhost:3000/api/meGusta/${idPublicacion}`);
      const meGusta = meGustaResponse.data || [];
      
      // Obtener todos los me gustas para verificar si el usuario actual dio like
      const todosLosMeGustasResponse = await axios.get(`http://localhost:3000/api/meGusta/elemento/${idPublicacion}`);
      const todosLosMeGustas = todosLosMeGustasResponse.data || [];
      
      // Verificar si el usuario actual ha dado like
      const hasLiked = todosLosMeGustas.some(mg => mg.idUser === idUsuario);
      setUserLikePublicacion(hasLiked);
      
      if (meGusta.length === 0) {
        console.error("No hay me gustas");
        return;
      }
      setMeGustasPublicacion(meGusta);
    } catch (error) {
      console.error("Error obteniendo me gustas:", error);
    }
  }

  /**
   * Método para obtener la cantidad de comentarios de una publicación
   * @param {number} idPublicacion - ID de la publicación
   */
  const cargarNumeroComentarios = async (idPublicacion) => {
    try {
      const numeroComentariosResponse = await axios.get(`http://localhost:3000/api/comentarios/numero/${idPublicacion}`);
      const numeroComentariosData = numeroComentariosResponse.data || [];

      if (numeroComentariosData.length === 0) {
        console.error("No se encontró el número de comentarios");
        return;
      }
      setNumeroComentarios(numeroComentariosData);
    } catch (error) {
      console.error("Error obteniendo número de comentarios:", error);
    }
  }

  /**
   * Método para navegar a la vista de la que precedemos
   * Redirige según el tipo de vista anterior (inicio o perfil)
   * @param {number} IDUsuario - ID del usuario publicador
   */
  const handleInicio = async (IDUsuario) => {
    switch (previusPath) {
      case 0:
        navigate("/Inicio");
        break;
      case 1:
        navigate("/PerfilPublicaciones", {state: { idUser: IDUsuario }});
        break;
      default:
        navigate("/Inicio");
    }
    console.log("Inicio");
  }

  /**
   * Método para dar o eliminar me gusta a una publicación
   * Actualiza el estado local y recarga los datos
   * @param {number} idPublicacion - ID de la publicación
   */
  const handleMeGustaPublicacion = async (idPublicacion) => {
    try {
      await handleMeGusta(idUsuario, idPublicacion);
      
      // Actualizar el estado local inmediatamente
      setUserLikePublicacion(prev => !prev);
      
      // Actualizar el contador localmente para feedback inmediato
      setMeGustasPublicacion(prevState => {
        if (!prevState || !prevState[0]) return [{ contador: userLikePublicacion ? 0 : 1 }];
        
        const newCount = userLikePublicacion 
          ? Math.max(0, prevState[0].contador - 1) 
          : prevState[0].contador + 1;
          
        return [{ ...prevState[0], contador: newCount }];
      });
      
      // Agregar un pequeño retraso antes de recargar los datos del servidor
      setTimeout(async () => {
        await cargarMeGustasPublicacion(idPublicacion);
      }, 300);
    } catch (error) {
      console.error("Error al dar me gusta a la publicación:", error);
    }
  }

  /**
   * Método para dar o eliminar me gusta a un comentario
   * Gestiona la adición o eliminación del me gusta en la base de datos
   * @param {number} idComentario - ID del comentario
   */
  const handleMeGustaComentario = async (idComentario) => {
    try {
      const meGustasComentarioResponse = await axios.get(`http://localhost:3000/api/meGustaComentarios`);
      const meGustasComentario = meGustasComentarioResponse.data || [];
  
      const hasLiked = meGustasComentario.some(
        meGustaComantario => 
          meGustaComantario.idComent === idComentario && 
          meGustaComantario.iDusuario === idUsuario
      );
  
      if (hasLiked) {
        await axios.delete(`http://localhost:3000/api/meGustaComentarios/${idUsuario}/${idComentario}`);
      } else {
        const nuevoMeGusta = {
          iDusuario: idUsuario,
          idComent: idComentario
        };
        await axios.post("http://localhost:3000/api/meGustaComentarios", nuevoMeGusta);
      }
  
      // Actualizar el estado local inmediatamente
      setUserLikesComentarios(prev => ({
        ...prev,
        [idComentario]: !prev[idComentario]
      }));
  
      // Actualizar los comentarios para refrescar el contador
      setTimeout(async () => {
        await cargarComentarios();
      }, 300);
    } catch (error) {
      console.error("Error al dar me gusta:", error);
    }
  };

  /**
   * Método para navegar al perfil del usuario que ha subido la publicación
   * @param {number} idUser - ID del usuario a visualizar
   */
  const handleVisualizarPerfil = (idUser) => {
    navigate("/Perfil", { state: { idUser } });
  }

  /**
   * Método para publicar un nuevo comentario
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
      const nuevoComentario = {
        text: texto,
        user: idUsuario,
        post: idElemento
      };
      
      await axios.post("http://localhost:3000/api/comentarios", nuevoComentario);
      setTexto("");
      
      // Recargar todos los datos necesarios
      await Promise.all([
        cargarPublicacion(),
        cargarNumeroComentarios(idElemento)
      ]);
      
      // Cargar comentarios después de la publicación
      await cargarComentarios();
      
      setHayComentarios(true);
    } catch (error) {
      console.error("Error al publicar:", error);
    } finally {
      setCargando(false);
    }
  };

  // Color del contador de caracteres basado en la longitud del texto
  const colorContador = texto.length === maxCaracteres ? "red" : texto.length >= advertenciaCaracteres ? "orange" : "white";

  // Muestra animación de carga mientras se procesan los datos
  if (cargando) { return (carga()) }

  return (
    <div className="container_overflow">
      <div className="container_fila_paddingBottom">
        <button type='submit' onClick={() => handleInicio(usuarioPublicador.idUsuario)} className="boton_fondo_15_v3">Publicaciones</button>
        <h2 className="titulo_c4">Comentarios</h2>
      </div>
      <div className="container_columna_2c_v5">
        <div className="container_fila_padding">
          {usuarioPublicador && (
            <div className="container_fila_noJustify_v2">
              <button onClick={() => {handleVisualizarPerfil(usuarioPublicador.idUsuario)}} className="boton_fondo_2c_v2">
                <img src={usuarioPublicador.fotoPerfil} alt="Foto de perfil" className="imagen_perfil"/>
                <h3 className="titulo_f">{usuarioPublicador.nickName}</h3>
              </button>
              <p className="datos_v2">{new Date(publicacion.fechaPublicacion).toLocaleDateString()}</p>
              {meGustasPublicacion && (
              <div className="container_marginLeft">
                <p className="datos">{meGustasPublicacion[0]?.contador || 0}</p>
                <button type='button' onClick={() => handleMeGustaPublicacion(publicacion.idPublicaciones)} className="boton_fondo_2c_v4"> {userLikePublicacion ? <HandThumbUpIcon className="icono"/> : <NoMeGustaIcono className="icono"/>} </button>
                <p className="datos">{numeroComentarios.contador}</p>
                <button type='button' className="boton_fondo_2c_v4"><ChatBubbleOvalLeftIcon className="icono"/></button>
              </div>
              )}
            </div>
          )}
        </div>
        <p className="datos_2c">{publicacion.texto}</p>
        <hr className="linea_separadora"/>
        <div className="container_2c">
          <div className="container_fila_noJustify">
            <img src={usuarioComentador.fotoPerfil} alt="Foto de perfil" className="imagen_perfil"/>
            <h3 className="titulo_f">{usuarioComentador.nickName}</h3>
          </div>
          <div className="container_columna_v2">
            <div className="container_fila_noJustify_v2">
              <textarea className="textarea" placeholder="Comenta tu opinión..." maxLength={450} onChange={(e) => setTexto(e.target.value)} value={texto}></textarea>
              <button type='submit' onClick={handlePublicar} className="boton_fondo_2c_v5"><PaperAirplaneIcon className="icono_v2"/></button>
            </div>
            <p style={{ color:colorContador, fontSize: "1.75vh", transition: "color 0.5s" }}> {texto.length}/{maxCaracteres} caracteres </p>
          </div>
        </div>
      </div>
      <br/>
      <div className="container_overflow_padding">
        {hayComentarios && comentarios.map((comentario) => (
          <div key={comentario.idComentarios} className="container_2c">
            <div className="container_columna_100">
              <div className="container_fila_spaceBetween_v2">
                {comentario.usuarioComentador && (
                  <button onClick={() => {handleVisualizarPerfil(comentario.usuarioComentador.idUsuario)}} className="boton_fondo_2c_v6">
                    <img src={comentario.usuarioComentador.fotoPerfil} alt="Foto de perfil" className="imagen_perfil" />
                    <h3 className="titulo_f">{comentario.usuarioComentador.nickName}</h3>
                  </button>
                )}
                <div className="container_gap">
                  <p className="datos">{comentario.meGustaComentario}</p>
                  <button type='button' onClick={() => handleMeGustaComentario(comentario.idComentarios)} className="boton_fondo_2c_v4"> {userLikesComentarios[comentario.idComentarios] ? <HandThumbUpIcon className="icono"/> : <NoMeGustaIcono className="icono"/>} </button>
                </div>
              </div>
              <p className="datos_2c">{comentario.text}</p>
            </div>
          </div> 
        ))}
      </div>
      <br/>
    </div>
  )
}

export default Comentarios;