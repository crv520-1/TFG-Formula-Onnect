import { ArrowRightEndOnRectangleIcon, ChatBubbleOvalLeftIcon, HandThumbUpIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";

export const PerfilPublicaciones = () => {
  const navigate = useNavigate();
  const { user: idUsuario } = useContext(UsuarioContext);
  const [usuario, setUsuario] = useState({});
  const [publicaciones, setPublicaciones] = useState([]);
  const [meGustasPublicaciones, setMeGustasPublicaciones] = useState([]);
  const [comentariosPublicaciones, setComentariosPublicaciones] = useState([]);
  const [seguidores, setSeguidores] = useState(0);
  const [siguiendo, setSiguiendo] = useState(0);
  const [numeroPublicaciones, setNumeroPublicaciones] = useState(0);
  const [cargando, setCargando] = useState(true);

  // Función para cargar los datos del usuario y sus publicaciones
  const cargarDatosUsuario = async () => {
    try {
      // Obtener usuario
      const usuariosResponse = await axios.get("http://localhost:3000/api/usuarios");
      const usuarioEncontrado = usuariosResponse.data.find(user => user.idUsuario === idUsuario);
      if (!usuarioEncontrado) {
        console.error("Usuario no encontrado");
        setCargando(false);
        return;
      }
      setUsuario(usuarioEncontrado);

      // Obtener publicaciones del usuario
      const publicacionesResponse = await axios.get(`http://localhost:3000/api/publicaciones/${idUsuario}`);
      const publicacionesUsuario = publicacionesResponse.data || [];
      setPublicaciones(publicacionesUsuario);
      

      // Obtener número de publicaciones del usuario
      const numeroPublicacionesResponse = await axios.get(`http://localhost:3000/api/publicaciones/count/${idUsuario}`);
      const numeroPublicacionesUsuario = numeroPublicacionesResponse.data;
      setNumeroPublicaciones(numeroPublicacionesUsuario["COUNT(*)"] || 0);

      // Obtener seguidores
      try {
        const seguidoresResponse = await axios.get(`http://localhost:3000/api/seguidores/seguidores/${idUsuario}`);
        setSeguidores(seguidoresResponse.data["COUNT(*)"] || 0);
      } catch (error) {
        console.error("Error obteniendo seguidores:", error);
        setSeguidores(0);
      }
      
      // Obtener siguiendo
      try {
        const siguiendoResponse = await axios.get(`http://localhost:3000/api/seguidores/siguiendo/${idUsuario}`);
        setSiguiendo(siguiendoResponse.data["COUNT(*)"] || 0);
      } catch (error) {
        console.error("Error obteniendo siguiendo:", error);
        setSiguiendo(0);
      }

      setCargando(false);
    } catch (error) {
      console.error("Error obteniendo datos:", error);
      setCargando(false);
    }
  };

  const cargarDatosPublicaciones = async () => {
    if (publicaciones.length === 0) return;

    try {
      const idsPublicaciones = publicaciones.map(publicacion => publicacion.idPublicaciones);
      
      const [comentariosResults, meGustasResults] = await Promise.all([
        Promise.all(idsPublicaciones.map(idPublicacion => 
            axios.get(`http://localhost:3000/api/comentarios/numero/${idPublicacion}`)
        )),
        Promise.all(idsPublicaciones.map(idPublicacion => 
            axios.get(`http://localhost:3000/api/meGusta/${idPublicacion}`)
        ))
      ]);
      
      const todosLosComentarios = comentariosResults.flatMap(response => response.data || []);
      setComentariosPublicaciones(todosLosComentarios);
      
      const todosLosMeGustas = meGustasResults.flatMap(response => response.data || []);
      setMeGustasPublicaciones(todosLosMeGustas);
      
    } catch (error) {
      console.error("Error obteniendo datos de publicaciones:", error);
      setComentariosPublicaciones([]);
      setMeGustasPublicaciones([]);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatosUsuario();
  }, [idUsuario]);

  // Cargar me gustas cuando cambian las publicaciones
  useEffect(() => {
    cargarDatosPublicaciones();
  }, [publicaciones]);

  const handleDatos = (e) => {
    e.preventDefault();
    navigate("/Perfil");
  };

  const handleEditarPerfil = (e) => {
    e.preventDefault();
    navigate("/EditarPerfil");
  };

  const handleMeGusta = async (idPublicacion) => {
    try {
      const meGustasResponse = await axios.get(`http://localhost:3000/api/meGusta`);
      const meGustas = meGustasResponse.data || [];
      
      // Verificar si ya dio me gusta
      if (meGustas.some(meGusta => meGusta.idElemento === idPublicacion && meGusta.idUser === idUsuario)) {
        alert("Ya has dado me gusta a esta publicación");
        return;
      }
      
      // Añadir nuevo me gusta
      const nuevoMeGusta = {
        idUser: idUsuario,
        idElemento: idPublicacion
      };
      
      await axios.post("http://localhost:3000/api/meGusta", nuevoMeGusta);
      
      // Actualizar me gustas después de añadir uno nuevo
      cargarDatosPublicaciones();
    } catch (error) {
      console.error("Error al dar me gusta:", error);
    }
  };

  const handleComentarios = (idPublicacion) => {
    // Pasar el ID de la publicación como parámetro para la vista de comentarios
    navigate(`/Comentarios`, { state: { idElemento: idPublicacion, previusPath: 1 } });
  };

  const handleCerrarSesion = () => {
    navigate("/IniciarSesion");
  };
  
  if (cargando) { 
    return <h1>Cargando el perfil del usuario</h1>;
  }

  // Función para obtener el contador de me gustas para una publicación específica
  const obtenerContadorMeGusta = (idPublicacion) => {
    const meGusta = meGustasPublicaciones.find(mg => mg.idElemento === idPublicacion);
    return meGusta ? meGusta.contador : 0;
  };

  const obtenerContadorComentarios = (idPublicacion) => {
    const comentarios = comentariosPublicaciones.find(comentario => comentario.post === idPublicacion);
    return comentarios ? comentarios.contador : 0;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", maxHeight: "98vh", overflow: "auto" }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }} >
        <h1 style={{ fontSize: "4vh", textAlign: "center" }}> {usuario.nickName} </h1>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          <img src={usuario.fotoPerfil} alt="Foto de perfil" style={{ width: "15vh", height: "15vh", borderRadius: "50%", color:"white", backgroundColor:"white" }} />
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
              <p style={{ fontSize: "3vh", marginLeft: "1vh", margin: "1vh" }}>{usuario.nombreCompleto}</p>
              <button type='submit' onClick={handleEditarPerfil} style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", height:"3vh", border: "none", backgroundColor:"#15151E" }}><PencilSquareIcon style={{ width: "2vh", height: "2vh" }} /></button>
              <button type='submit' onClick={handleCerrarSesion} style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", height:"3vh", border: "none", backgroundColor:"#15151E" }}><ArrowRightEndOnRectangleIcon style={{ width: "2vh", height: "2vh" }} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginLeft: "2vh" }}>
                <p style={{ fontSize: "1.5vh", margin: "0.3vh 0" }}> Publicaciones </p>
                <p style={{ fontSize: "1.5vh", margin: "0" }}> {numeroPublicaciones} </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginLeft: "2vh" }}>
                <p style={{ fontSize: "1.5vh", margin: "0.3vh 0" }}> Seguidores </p>
                <p style={{ fontSize: "1.5vh", margin: "0" }}> {seguidores} </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginLeft: "2vh" }}>
                <p style={{ fontSize: "1.5vh", margin: "0.3vh 0" }}> Siguiendo </p>
                <p style={{ fontSize: "1.5vh", margin: "0" }}> {siguiendo} </p>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} >
          <button type='submit' onClick={handleDatos} style={{ fontSize: "2vh", height:"3vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border:"none", backgroundColor:"#15151E" }}>Datos</button>
          <h2 style={{ backgroundColor: "#C40000", borderRadius:"0.5vh", width: "15vh", fontSize:"2vh", textAlign: "center", marginLeft: "35vh" }}>Publicaciones</h2>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", maxHeight: "100%", overflow: "auto", paddingRight:"2vh" }}>
        {publicaciones.map((publicacion) => (
          <div key={publicacion.idPublicaciones} style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor:"#2c2c2c", width:"50vw", height:"auto", borderRadius:"1vh", marginBottom: "2vh" }}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", paddingTop:"1vh", width: "95%", paddingLeft: "1vh", paddingRight: "1vh" }}>
              <img src={usuario.fotoPerfil} style={{ width: "3vh", height: "3vh", borderRadius: "50%", backgroundColor:"white" }} />
              <p style={{marginLeft:"1vw", fontSize:"1.5vh"}}>{usuario.nickName}</p>
              <p style={{marginLeft:"2vw", fontSize:"1.5vh"}}>{new Date(publicacion.fechaPublicacion).toLocaleDateString()}</p>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
                <p style={{fontSize:"1.5vh"}}>{obtenerContadorMeGusta(publicacion.idPublicaciones)}</p>
                <button type='button' onClick={() => handleMeGusta(publicacion.idPublicaciones)} style={{ fontSize: "2vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", height:"3vh", border: "none", backgroundColor:"#2c2c2c" }}> <HandThumbUpIcon style={{ width: "2vh", height: "2vh" }} /> </button>
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