import { PaperAirplaneIcon, XCircleIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";
import "../styles/Containers.css";
import { carga } from "./animacionCargando";

export const Crear = () => {
  const [cargando, setCargando] = useState(true);
  const [usuario, setUsuario] = useState([]);
  const [texto, setTexto] = useState("");
  const navigate = useNavigate();
  const { user: idUsuario } = useContext(UsuarioContext);
  const maxCaracteres = 450;
  const advertenciaCaracteres = 400;
  
  useEffect(() => {
    const fetchData = async () => {
      setCargando(true);
      try {
        // Obtener usuario
        const usuarioEncontrado = await obtenerDatos();
        setUsuario(usuarioEncontrado);
        setTimeout(() => { setCargando(false); }, 500);
      } catch (error) {
        console.error("Error obteniendo datos:", error);
      }
    };
    fetchData();
  }, [idUsuario]);

  const obtenerDatos = async () => {
    const response = await axios.get(`http://localhost:3000/api/usuarios/${idUsuario}`);
    const data = response.data;
    if (!data) {
      console.error("No se encontraron datos");
      return;
    }
    return data;
  };

  const handleCancelar = (e) => {
    e.preventDefault();
    console.log("Cancelar");
    navigate("/Inicio");
  }

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

  const colorContador = texto.length === maxCaracteres ? "red" : texto.length >= advertenciaCaracteres ? "orange" : "white";

  if (cargando) { return(carga()) }

  return (
    <div className="container_columna">
      <h2 className="titulo_c4_v2">Publicaciones</h2>
      <br />
      <div className="container_columna_completo_v2">
        <div className="container_fila_spaceBetween">
          <button type='submit' onClick={handleCancelar} className="boton_fondo_2c_v5"><XCircleIcon style={{ width: "3vh", height: "3vh", color:"white" }} /></button>
          <div className="container_flexCenter">
            <img src={usuario.fotoPerfil} style={{ width: "5vh", height: "5vh", borderRadius: "50%", backgroundColor:"white" }} />
            <p className="datos_v4"> {usuario.nickName} </p>
          </div>
          <button type='submit' onClick={handlePublicar} className="boton_fondo_2c_v5"><PaperAirplaneIcon style={{ width: "3vh", height: "3vh", color:"white" }} /></button>
        </div>
        <textarea className="textarea_v2" placeholder="Comenta tu opinión..." maxLength={450} onChange={(e) => setTexto(e.target.value)}></textarea>
        <p style={{ color:colorContador, fontSize: "1.5vh", transition: "color 0.5s" }}> {texto.length}/{maxCaracteres} caracteres </p>
      </div>
    </div> 
  )
}

export default Crear;