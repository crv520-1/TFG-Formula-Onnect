import { PaperAirplaneIcon, XCircleIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";
import "../styles/Containers.css";
import { carga } from "./animacionCargando";

/**
 * Componente que permite a los usuarios crear nuevas publicaciones
 * Muestra un formulario con área de texto y botones de acción
 */
export const Crear = () => {
  // Estados para manejar la carga, usuario y texto de la publicación
  const [cargando, setCargando] = useState(true);
  const [usuario, setUsuario] = useState([]);
  const [texto, setTexto] = useState("");
  const navigate = useNavigate();
  const { user: idUsuario } = useContext(UsuarioContext);
  
  // Constantes para control de longitud del texto
  const maxCaracteres = 450;
  const advertenciaCaracteres = 400;
  
  useEffect(() => {
    /**
     * Función que carga los datos del usuario al iniciar el componente
     */
    const fetchData = async () => {
      setCargando(true);
      try {
        const usuarioEncontrado = await obtenerDatos();
        setUsuario(usuarioEncontrado);
        setTimeout(() => { setCargando(false); }, 500); // Pequeño delay para mostrar la animación de carga
      } catch (error) {
        console.error("Error obteniendo datos:", error);
      }
    };
    fetchData();
  }, [idUsuario]);

  /**
   * Función para obtener los datos del usuario desde el backend
   * @returns {Object} Datos del usuario
   */
  const obtenerDatos = async () => {
    const response = await axios.get(`http://localhost:3000/api/usuarios/${idUsuario}`);
    const data = response.data;
    if (!data) {
      console.error("No se encontraron datos");
      return;
    }
    return data;
  };

  /**
   * Controlador del botón cancelar que retorna a la vista de inicio
   * @param {Event} e - Evento del botón
   */
  const handleCancelar = (e) => {
    e.preventDefault();
    console.log("Cancelar");
    navigate("/Inicio");
  }

  /**
   * Controlador para publicar el contenido y crear una nueva publicación
   * Valida que el texto no esté vacío y envía los datos al servidor
   * @param {Event} e - Evento del botón
   */
  const handlePublicar = async (e) => {
    e.preventDefault();
    if (texto.length === 0) {
      alert("Tienes que introducir texto para poder publicar");
      return;
    }
    const fechaActual = new Date().toISOString().split("T")[0];
    const nuevaPublicacion = {
      texto: texto,
      usuario: usuario.idUsuario,
      fechaPublicacion: fechaActual
    };
    try {
      await axios.post("http://localhost:3000/api/publicaciones", nuevaPublicacion);
    }
    catch (error) {
      console.error("Error al publicar:", error);
    }
    navigate("/PerfilPublicaciones", { state: { idUser: idUsuario } });
  }

  // Color del contador basado en la longitud del texto
  const colorContador = texto.length === maxCaracteres ? "red" : texto.length >= advertenciaCaracteres ? "orange" : "white";

  // Muestra animación de carga mientras se obtienen los datos
  if (cargando) { return(carga()) }

  return (
    <div className="container_columna">
      <h2 className="titulo_c4_v2">Publicaciones</h2>
      <br />
      <div className="container_columna_completo_v2">
        <div className="container_fila_spaceBetween">
          <button type='submit' onClick={handleCancelar} className="boton_fondo_2c_v5"><XCircleIcon className="icono_v2"/></button>
          <div className="container_flexCenter">
            <img src={usuario.fotoPerfil} className="imagen_perfil_v3"/>
            <p className="datos_v4"> {usuario.nickName} </p>
          </div>
          <button type='submit' onClick={handlePublicar} className="boton_fondo_2c_v5"><PaperAirplaneIcon className="icono_v2"/></button>
        </div>
        <textarea className="textarea_v2" placeholder="Comenta tu opinión..." maxLength={450} onChange={(e) => setTexto(e.target.value)}></textarea>
        <p style={{ color:colorContador, fontSize: "1.75vh", transition: "color 0.5s" }}> {texto.length}/{maxCaracteres} caracteres </p>
      </div>
    </div> 
  )
}

export default Crear;