import { ChatBubbleOvalLeftIcon, HandThumbUpIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";

export const Comentarios = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { idElemento, previusPath } = location.state || {};
  const { user: idUsuario } = useContext(UsuarioContext);
  const [publicacion, setPublicacion] = useState({});
  const [comentarios, setComentarios] = useState({});
  const [usuarioPublicador, setUsuarioPublicador] = useState({});
  const [usuarioComentador, setUsuarioComentador] = useState({});
  const [meGustasPublicacion, setMeGustasPublicacion] = useState({});
  const [numeroComentarios, setNumeroComentarios] = useState({});
  const [texto, setTexto] = useState("");
  const [hayComentarios, setHayComentarios] = useState(false);
  const maxCaracteres = 450;
  const advertenciaCaracteres = 400;

  useEffect(() => {
    if (!idElemento) {
      console.error("No se ha proporcionado un ID de elemento");
      return;
    }
    cargarUsuarioComentador();
    cargarPublicacion();
    cargarComentarios();
  }, [idElemento]);

  const cargarUsuarioComentador = async () => {
    try {
      const usuarioComentadorResponse = await axios.get(`http://localhost:3000/api/usuarios/${idUsuario}`);
      const usuarioComentadorData = usuarioComentadorResponse.data || {};

      if (!usuarioComentadorData) {
        console.error("No se encontró el usuario comentador");
        return;
      }
      setUsuarioComentador(usuarioComentadorData);
    } catch (error) {
      console.error("Error obteniendo usuario comentador:", error);
    }
  }

  const cargarPublicacion = async () => {
    try {
      const publicacionResponse = await axios.get(`http://localhost:3000/api/publicaciones/publicacion/${idElemento}`);
      const publicacionEncontrada = publicacionResponse.data || {};
      
      if (!publicacionEncontrada) {
        console.error("No se encontró la publicación");
        return;
      }
      setPublicacion(publicacionEncontrada);
      cargarUsuarioPublicador(publicacionEncontrada.usuario);
      cargarMeGustasPublicacion(publicacionEncontrada.idPublicaciones);
      cargarNumeroComentarios(publicacionEncontrada.idPublicaciones);
    } catch (error) {
      console.error("Error obteniendo publicación:", error);
    }
  }

  const cargarComentarios = async () => {
    try {
      const comentariosResponse = await axios.get(`http://localhost:3000/api/comentarios/publicacion/${idElemento}`);
      const comentariosEncontrados = comentariosResponse.data || {};
      
      if (comentariosEncontrados.length === 0) {
        console.error("No hay comentarios");
        return;
      }
      
      const usuariosComentadores = await axios.get(`http://localhost:3000/api/usuarios`);
      const usuariosComentadoresData = usuariosComentadores.data || {};

      const mapaUsuariosComentadores = {};
      usuariosComentadoresData.forEach(user => {
        mapaUsuariosComentadores[user.idUsuario] = user;
      });

      const promesasComentarios = comentariosEncontrados.map(async comentario => {
        const usuarioComentador = mapaUsuariosComentadores[comentario.user];
        const meGustasComentarioResponse = await axios.get(`http://localhost:3000/api/meGustaComentarios/numero/${comentario.idComentarios}`);
        const meGustasComentario = meGustasComentarioResponse.data || [];
        const contadorMeGustas = meGustasComentario.length > 0 ? meGustasComentario[0].contador : 0;
        return {
          ...comentario,
          usuarioComentador: usuarioComentador || null,
          meGustaComentario: contadorMeGustas
        };
      });
      const comentariosCompletos = await Promise.all(promesasComentarios);
      setComentarios(comentariosCompletos);
      setHayComentarios(true);
    } catch (error) {
      console.error("Error obteniendo comentarios:", error);
    }
  };

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

  const cargarMeGustasPublicacion = async (idPublicacion) => {
    try {
      const meGustaResponse = await axios.get(`http://localhost:3000/api/meGusta/${idPublicacion}`);
      const meGusta = meGustaResponse.data || [];
      
      if (meGusta.length === 0) {
        console.error("No hay me gustas");
        return;
      }
      setMeGustasPublicacion(meGusta);
    } catch (error) {
      console.error("Error obteniendo me gustas:", error);
    }
  }

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

  const handleInicio = async (IDUsuario) => {
    switch (previusPath) {
      case 0:
        navigate("/Inicio");
        break;
      case 1:
        navigate("/PerfilPublicaciones");
        break;
      case 2:
        navigate("/PublicacionesOtroUsuario", {state: { idUser: IDUsuario }});
        break;
      default:
        navigate("/Inicio");
    }
    console.log("Inicio");
  }

  const handleMeGusta = async (idPublicacion) => {
    try {
      const meGustasResponse = await axios.get(`http://localhost:3000/api/meGusta`);
      const meGustas = meGustasResponse.data || [];
      
      if (meGustas.some(meGusta => meGusta.idElemento === idPublicacion && meGusta.idUser === idUsuario)) {
        alert("Ya has dado me gusta a esta publicación");
        return;
      }

      const nuevoMeGusta = {
        idUser: idUsuario,
        idElemento: idPublicacion
      };
      
      await axios.post("http://localhost:3000/api/meGusta", nuevoMeGusta);
      cargarMeGustasPublicacion(idPublicacion);
    } catch (error) {
      console.error("Error al dar me gusta:", error);
    }
  }

  const handleMeGustaComentario = async (idComentario) => {
    try {
      const meGustasComentarioResponse = await axios.get(`http://localhost:3000/api/meGustaComentarios`);
      const meGustasComentario = meGustasComentarioResponse.data || [];

      if (meGustasComentario.some(meGustaComantario => meGustaComantario.idComent === idComentario && meGustaComantario.iDusuario === idUsuario)) {
        alert("Ya has dado me gusta a este comentario");
        return;
      }

      const nuevoMeGusta = {
        iDusuario: idUsuario,
        idComent: idComentario
      };

      await axios.post("http://localhost:3000/api/meGustaComentarios", nuevoMeGusta);
      cargarComentarios();
    } catch (error) {
      console.error("Error al dar me gusta:", error);
    }
    console.log("Me gusta comentario", idComentario);
  }

  const handleVisualizarPerfil = (idUser) => {
    if (idUser === idUsuario) {
      navigate("/Perfil");
    } else {
      navigate(`/OtroPerfil`, {state: { idUser }});
    }
  }

  const handlePublicar = async (e) => {
    e.preventDefault();
    if (texto.length === 0) {
      alert("Tienes que introducir texto para poder publicar");
      return;
    }
    const nuevoComentario = {
      text: texto,
      user: idUsuario,
      post: idElemento
    };
    try {
      await axios.post("http://localhost:3000/api/comentarios", nuevoComentario);
      setTexto("");
      await Promise.all([cargarPublicacion(), cargarComentarios()]);
      cargarPublicacion();
      cargarComentarios();
    }
    catch (error) {
      console.error("Error al publicar:", error);
    }
    console.log("Publicar comentario");
  }

  const colorContador = texto.length === maxCaracteres ? "red" : texto.length >= advertenciaCaracteres ? "orange" : "white";

  return (
    <div style={{ display: "flex", flexDirection: "column", maxHeight: "98vh", overflow: "auto", overflowX: "hidden" }}>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", paddingBottom: "2vh" }} >
        <button type='submit' onClick={() => handleInicio(usuarioPublicador.idUsuario)} style={{ fontSize: "2vh", height:"3vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border:"none", backgroundColor:"#15151E" }}>Publicaciones</button>
        <h2 style={{ backgroundColor: "#C40000", borderRadius:"0.5vh", width: "15vh", fontSize:"2vh", textAlign: "center", marginLeft:"20vw" }}>Comentarios</h2>
      </div>
      <div style={{  display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor:"#2c2c2c", width:"50vw", height:"auto", borderRadius:"1vh", marginTop: "2vh" }}>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", paddingTop:"1vh", paddingLeft: "1vh", paddingRight: "1vh" }}>
          {usuarioPublicador && (
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
              <button onClick={() => {handleVisualizarPerfil(usuarioPublicador.idUsuario)}} style={{ border:"none", backgroundColor:"#2c2c2c", display: "flex", flexDirection: "row", alignItems: "center" }}>
                <img src={usuarioPublicador.fotoPerfil} alt="Foto de perfil" style={{ width: "3vh", height: "3vh", borderRadius: "50%", backgroundColor:"white" }} />
                <h3 style={{ color: "#FFFFFF", marginLeft: "1vw", fontSize: "1.5vh" }}>{usuarioPublicador.nickName}</h3>
              </button>
              <p style={{marginLeft:"2vw", fontSize:"1.5vh"}}>{new Date(publicacion.fechaPublicacion).toLocaleDateString()}</p>
              {meGustasPublicacion && (
              <div style={{ marginLeft: "27vw", display: "flex", alignItems: "center" }}>
                <p style={{fontSize:"1.5vh"}}>{meGustasPublicacion[0]?.contador || 0}</p>
                <button type='button' onClick={() => handleMeGusta(publicacion.idPublicaciones)} style={{ fontSize: "2vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", height:"3vh", border: "none", backgroundColor:"#2c2c2c" }}> <HandThumbUpIcon style={{ width: "2vh", height: "2vh" }} /> </button>
                <p style={{marginLeft:"1vw", fontSize:"1.5vh"}}>{numeroComentarios.contador}</p>
                <button type='button' style={{ fontSize: "2vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", height:"3vh", border: "none", backgroundColor:"#2c2c2c" }}><ChatBubbleOvalLeftIcon style={{ width: "2vh", height: "2vh" }} /></button>
              </div>
              )}
            </div>
          )}
        </div>
        <p style={{margin:"1vh", fontSize:"2vh", backgroundColor:"#2c2c2c", border: "none", textAlign: "left", width: "95%"}}>{publicacion.texto}</p>
        {/*Línea separadora*/}
        <hr style={{width:"99%", backgroundColor:"#FFFFFF", opacity:"0.5"}} />
        <div style={{ backgroundColor:"#2c2c2c", width:"50vw", height:"auto", borderRadius:"1vh", marginTop: "1vh" }}>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", paddingLeft:"1vw" }}>
            <img src={usuarioComentador.fotoPerfil} alt="Foto de perfil" style={{ width: "3vh", height: "3vh", borderRadius: "50%", backgroundColor:"white" }} />
            <h3 style={{ color: "#FFFFFF", marginLeft: "1vw", fontSize: "1.5vh" }}>{usuarioComentador.nickName}</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
              <textarea style={{ width: "45vw", height: "5vh", backgroundColor: "#2c2c2c", color: "white", fontSize: "2vh", borderRadius: "1vh", marginTop:"1vh", resize:"none" }} placeholder="Comenta tu opinión..." maxLength={450} onChange={(e) => setTexto(e.target.value)} value={texto}></textarea>
              <button type='submit' onClick={handlePublicar} style={{ display: "flex", alignItems: "center", justifyContent: "center", height:"5vh", border: "none", backgroundColor: "#2c2c2c" }}><PaperAirplaneIcon style={{ width: "3vh", height: "3vh", color:"white" }} /></button>
            </div>
            <p style={{ color:colorContador, fontSize: "1.5vh", transition: "color 0.5s" }}> {texto.length}/{maxCaracteres} caracteres </p>
          </div>
        </div>
      </div>
      <div style={{paddingBottom: "2vh" }}></div>
      <div style={{ display: "flex", flexDirection: "column", maxHeight: "100%", overflow: "auto", paddingRight:"2vh", overflowX: "hidden" }}>
        {hayComentarios && comentarios.map((comentario) => (
          <div key={comentario.idComentarios} style={{ backgroundColor:"#2c2c2c", width:"50vw", borderRadius:"1vh", marginTop: "2vh" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", paddingTop:"1vh", paddingRight: "1vh" }}>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between",  width: "100%" }}>
                {comentario.usuarioComentador && (
                  <button onClick={() => {handleVisualizarPerfil(comentario.usuarioComentador.idUsuario)}} style={{ border:"none", backgroundColor:"#2c2c2c", display: "flex", flexDirection: "row", alignItems: "center", paddingLeft:"1vw" }}>
                    <img src={comentario.usuarioComentador.fotoPerfil} alt="Foto de perfil" style={{ width: "3vh", height: "3vh", borderRadius: "50%", backgroundColor:"white" }} />
                    <h3 style={{ color: "#FFFFFF", marginLeft: "1vw", fontSize: "1.5vh" }}>{comentario.usuarioComentador.nickName}</h3>
                  </button>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5vw" }}>
                  <p style={{fontSize:"1.5vh"}}>{comentario.meGustaComentario}</p>
                  <button type='button' onClick={() => handleMeGustaComentario(comentario.idComentarios)} style={{ fontSize: "2vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", height:"3vh", border: "none", backgroundColor:"#2c2c2c" }}> <HandThumbUpIcon style={{ width: "2vh", height: "2vh" }} /> </button>
                </div>
              </div>
              <p style={{margin:"1vh", fontSize:"1.75vh", backgroundColor:"#2c2c2c", border: "none", textAlign: "left", width: "95%"}}>{comentario.text}</p>
            </div>
          </div> 
        ))}
      </div>
    </div>
  )
}

export default Comentarios;