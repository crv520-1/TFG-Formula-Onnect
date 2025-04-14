import axios from "axios";
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";
import "../styles/Botones.css";
import "../styles/Containers.css";
import "../styles/Imagenes.css";
import "../styles/Textos.css";
import { carga } from "./animacionCargando.jsx";
import HeaderPerfil from "./HeaderPerfil";
import { getImagenCircuito, getImagenEquipo, getImagenPiloto } from './mapeoImagenes.js';

/**
 * Componente que muestra el perfil de un usuario y sus favoritos
 * Gestiona la visualización de datos personales, estadísticas y elementos favoritos
 */
export const Perfil = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Obtiene el ID del usuario a visualizar desde el estado de navegación
  const { idUser } = location.state || {};
  // Obtiene el ID del usuario logueado del contexto
  const { user: idUsuario } = useContext(UsuarioContext);
  
  // Estados para almacenar información
  const [usuario, setUsuario] = useState([]);
  const [seguidores, setSeguidores] = useState([]);
  const [siguiendo, setSiguiendo] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [sigo, setSigo] = useState(false);
  const [mismoUsuario, setMismoUsuario] = useState(false);
  const [imagenPiloto, setImagenPiloto] = useState("");
  const [imagenEquipo, setImagenEquipo] = useState("");
  const [imagenCircuito, setImagenCircuito] = useState("");
  const [numeroPublicaciones, setNumeroPublicaciones] = useState(0);

  useEffect(() => {
    /**
     * Función que carga todos los datos del perfil
     * Obtiene información del usuario, favoritos, seguidores y publicaciones
     */
    const cargarDatos = async () => {
      try {
        const usuariosResponse = await axios.get("http://localhost:3000/api/usuarios");
        const usuario = await cargarUsuario(usuariosResponse, idUser);
        setUsuario(usuario);
  
        // Cargar elementos favoritos del usuario
        const { pilotoFav, equipoFav, circuitoFav } = await cargarFavoritos(usuario);
        if (pilotoFav) setImagenPiloto(getImagenPiloto(pilotoFav.driverId));
        if (equipoFav) setImagenEquipo(getImagenEquipo(equipoFav.constructorId));
        if (circuitoFav) setImagenCircuito(getImagenCircuito(circuitoFav.circuitId));
  
        // Obtener número de publicaciones del usuario
        const publicacionesResponse = await axios.get(`http://localhost:3000/api/publicaciones/count/${idUser}`);
        setNumeroPublicaciones(publicacionesResponse.data["COUNT(*)"]);
  
        // Cargar información de seguidores y seguidos
        const { seguidores, siguiendo } = await cargarSeguidores(idUser);
        setSeguidores(seguidores);
        setSiguiendo(siguiendo);
  
        // Verificar relación entre usuario actual y perfil visitado
        const { mismoUsuario, sigo } = await verificarSeguimiento(idUser, idUsuario);
        setMismoUsuario(mismoUsuario);
        setSigo(sigo);
  
        // Pequeño delay para mostrar la animación de carga
        setTimeout(() => { setCargando(false); }, 500);
      } catch (error) {
        console.error("Error obteniendo datos:", error);
      }
    };
  
    cargarDatos();
  }, [idUser, idUsuario]);

  /**
   * Función para encontrar los datos del usuario específico
   * @param {Object} usuariosResponse - Respuesta con todos los usuarios
   * @param {number} idUser - ID del usuario a buscar
   * @returns {Object} Datos del usuario
   */
  const cargarUsuario = async (usuariosResponse, idUser) => {
    const usuarioEncontrado = usuariosResponse.data.find(user => user.idUsuario === idUser);
    if (!usuarioEncontrado) {
      throw new Error("Usuario no encontrado");
    }
    return usuarioEncontrado;
  };
  
  /**
   * Función para cargar los elementos favoritos del usuario
   * @param {Object} usuario - Datos del usuario
   * @returns {Object} Objetos con los favoritos del usuario
   */
  const cargarFavoritos = async (usuario) => {
    const [pilotosResponse, equiposResponse, circuitosResponse] = await Promise.all([
      axios.get("http://localhost:3000/api/pilotos"),
      axios.get("http://localhost:3000/api/equipos"),
      axios.get("http://localhost:3000/api/circuitos")
    ]);
  
    const pilotoFav = pilotosResponse.data.find(p => p.idPilotos === usuario.pilotoFav);
    const equipoFav = equiposResponse.data.find(e => e.idEquipos === usuario.equipoFav);
    const circuitoFav = circuitosResponse.data.find(c => c.idCircuitos === usuario.circuitoFav);
  
    return {
      pilotoFav,
      equipoFav,
      circuitoFav
    };
  };
  
  /**
   * Función para obtener el número de seguidores y seguidos
   * @param {number} idUser - ID del usuario a consultar
   * @returns {Object} Cantidades de seguidores y seguidos
   */
  const cargarSeguidores = async (idUser) => {
    try {
      const [seguidoresResponse, siguiendoResponse] = await Promise.all([
        axios.get(`http://localhost:3000/api/seguidores/seguidores/${idUser}`),
        axios.get(`http://localhost:3000/api/seguidores/siguiendo/${idUser}`)
      ]);
  
      return {
        seguidores: seguidoresResponse.data["COUNT(*)"] || 0,
        siguiendo: siguiendoResponse.data["COUNT(*)"] || 0
      };
    } catch (error) {
      console.error("Error obteniendo seguidores/siguiendo:", error);
      return { seguidores: 0, siguiendo: 0 };
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

  /**
   * Función para navegar a la vista de publicaciones del usuario
   */
  const handlePublicaciones = (e) => {
    e.preventDefault();
    navigate("/PerfilPublicaciones", { state: { idUser } });
  }

  /**
   * Función para actualizar el estado cuando cambia el número de seguidores
   * @param {number} nuevoNumeroSeguidores - Nuevo número de seguidores
   * @param {boolean} nuevoEstadoSigo - Nuevo estado de seguimiento
   */
  const handleSeguidoresChange = (nuevoNumeroSeguidores, nuevoEstadoSigo) => {
    setSeguidores(nuevoNumeroSeguidores);
    setSigo(nuevoEstadoSigo);
  };

  // Muestra animación de carga mientras se obtienen los datos
  if (cargando) { return carga(); }

  return (
    <div className="container_columna">
      <HeaderPerfil
        usuario={usuario}
        numeroPublicaciones={numeroPublicaciones}
        seguidores={seguidores}
        siguiendo={siguiendo}
        sigo={sigo}
        idUser={idUsuario}
        mismoUsuario={mismoUsuario}
        onSeguidoresChange={handleSeguidoresChange}
      />
      <div className="container_fila_paddingTop_v4">
        <h2 className="titulo_c4_v2">Datos</h2>
        <button type='submit' onClick={handlePublicaciones} className="boton_fondo_15_v2">Publicaciones</button>
      </div>
      <div className="container_fila_paddingTop_v4">
        <div className="container_columna_completo">
          <p className="datos_informativos"> Piloto Favorito </p>
          <img src={imagenPiloto} alt="Piloto" className="imagen"/>
        </div>
        <div className="container_columna_completo_v3">
          <p className="datos_informativos"> Circuito Favorito </p>
          <img src={imagenCircuito} alt="Circuito" className="imagen_v3"/>
        </div>
        <div className="container_columna_completo">
          <p className="datos_informativos"> Equipo Favorito </p>
          <img src={imagenEquipo} alt="Equipo" className="imagen_v2"/>
        </div>
      </div>
    </div> 
  )
}

export default Perfil;