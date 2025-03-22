import { PaperAirplaneIcon, XCircleIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";

export const Crear = () => {
  const [usuario, setUsuario] = useState([]);
  const [texto, setTexto] = useState("");
  const navigate = useNavigate();
  const { user: idUsuario } = useContext(UsuarioContext);
  const maxCaracteres = 450;
  const advertenciaCaracteres = 400;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener usuario
        const usuariosResponse = await axios.get("http://localhost:3000/api/usuarios");
        const usuarioEncontrado = usuariosResponse.data.find(user => user.idUsuario === idUsuario);
        if (!usuarioEncontrado) {
          console.error("Usuario no encontrado");
          return;
        }
        setUsuario(usuarioEncontrado);
        console.log(usuario);
      } catch (error) {
        console.error("Error obteniendo datos:", error);
      }
    };
    fetchData();
  }, [idUsuario]);

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
    navigate("/PerfilPublicaciones");
    console.log("Publicar");
  }

  const colorContador = texto.length === maxCaracteres ? "red" : texto.length >= advertenciaCaracteres ? "orange" : "white";

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }} >
      <h2 style={{ backgroundColor: "#C40000", borderRadius:"0.5vh", width: "15vh", fontSize:"2vh", textAlign: "center" }}>Publicaciones</h2>
      <br />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "75vh", height: "50vh", backgroundColor: "#2c2c2c", borderRadius: "1vh", paddingTop: "2vh" }}>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "70vh", backgroundColor: "#2c2c2c", borderRadius: "1vh" }}>
          <button type='submit' onClick={handleCancelar} style={{ display: "flex", alignItems: "center", justifyContent: "center", height:"5vh", border: "none", backgroundColor: "#2c2c2c" }}><XCircleIcon style={{ width: "3vh", height: "3vh", color:"white" }} /></button>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={usuario.fotoPerfil} style={{ width: "5vh", height: "5vh", borderRadius: "50%", backgroundColor:"white" }} />
            <p style={{ color:"white", marginLeft:"2vw", fontSize:"2vh" }}> {usuario.nickName} </p>
          </div>
          <button type='submit' onClick={handlePublicar} style={{ display: "flex", alignItems: "center", justifyContent: "center", height:"5vh", border: "none", backgroundColor: "#2c2c2c" }}><PaperAirplaneIcon style={{ width: "3vh", height: "3vh", color:"white" }} /></button>
        </div>
        <textarea style={{ width: "65vh", height: "100vh", backgroundColor: "#2c2c2c", color: "white", fontSize: "2vh", borderRadius: "1vh", marginTop:"2vh", marginBottom:"1vh", resize:"none" }} placeholder="Comenta tu opinión..." maxLength={450} onChange={(e) => setTexto(e.target.value)}></textarea>
        <p style={{ color:colorContador, fontSize: "1.5vh", transition: "color 0.5s" }}> {texto.length}/{maxCaracteres} caracteres </p>
      </div>
    </div> 
  )
}

export default Crear;