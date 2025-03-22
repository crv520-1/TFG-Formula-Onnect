import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";
import { getImagenCircuito, getImagenEquipo, getImagenPiloto } from './mapeoImagenes.js';

export const OtroPerfil = () => {
    const location = useLocation();
    const { idUser } = location.state || {};
    const { user: idUsuario } = useContext(UsuarioContext);
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState([]);
    const [pilotos, setPilotos] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [circuitos, setCircuitos] = useState([]);
    const [seguidores, setSeguidores] = useState([]);
    const [siguiendo, setSiguiendo] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [sigo, setSigo] = useState(false);
    const [imagenPiloto, setImagenPiloto] = useState("");
    const [imagenEquipo, setImagenEquipo] = useState("");
    const [imagenCircuito, setImagenCircuito] = useState("");
    const [numeroPublicaciones, setNumeroPublicaciones] = useState(0);

    console.log(idUser);

    useEffect(() => {
        const fetchData = async () => {
          try {
            // Obtener usuario
            const usuariosResponse = await axios.get("http://localhost:3000/api/usuarios");
            const usuarioEncontrado = usuariosResponse.data.find(user => user.idUsuario === idUser);
            if (!usuarioEncontrado) {
              console.error("Usuario no encontrado");
              return;
            }
            setUsuario(usuarioEncontrado);
    
            // Obtener piloto favorito
            const pilotosResponse = await axios.get("http://localhost:3000/api/pilotos");
            const pilotoFav = pilotosResponse.data.find(p => p.idPilotos === usuarioEncontrado.pilotoFav);
            setPilotos(pilotoFav);
            if (pilotoFav) setImagenPiloto(getImagenPiloto(pilotoFav.driverId));
    
            // Obtener equipo favorito
            const equiposResponse = await axios.get("http://localhost:3000/api/equipos");
            const equipoFav = equiposResponse.data.find(e => e.idEquipos === usuarioEncontrado.equipoFav);
            setEquipos(equipoFav);
            if (equipoFav) setImagenEquipo(getImagenEquipo(equipoFav.constructorId));
    
            // Obtener circuito favorito
            const circuitosResponse = await axios.get("http://localhost:3000/api/circuitos");
            const circuitoFav = circuitosResponse.data.find(c => c.idCircuitos === usuarioEncontrado.circuitoFav);
            setCircuitos(circuitoFav);
            if (circuitoFav) setImagenCircuito(getImagenCircuito(circuitoFav.circuitId));
    
            // Obtener número de publicaciones del usuario
            const numeroPublicacionesResponse = await axios.get(`http://localhost:3000/api/publicaciones/count/${idUser}`);
            const numeroPublicacionesUsuario = numeroPublicacionesResponse.data;
            if (!numeroPublicacionesUsuario) {
              console.error("Número de publicaciones no encontrado");
              return;
            }
            setNumeroPublicaciones(numeroPublicacionesUsuario["COUNT(*)"]);
            
            // Obtener seguidores
            try {
              const seguidoresResponse = await axios.get(`http://localhost:3000/api/seguidores/seguidores/${idUser}`);
              setSeguidores(seguidoresResponse.data["COUNT(*)"] || 0);
            } catch (error) {
              console.error("Error obteniendo seguidores:", error);
              setSeguidores(0);
            }
            console.log("Este usuario tiene seguidores: ", seguidores);
            
            // Obtener siguiendo
            try {
              const siguiendoResponse = await axios.get(`http://localhost:3000/api/seguidores/siguiendo/${idUser}`);
              setSiguiendo(siguiendoResponse.data["COUNT(*)"] || 0);
            } catch (error) {
              console.error("Error obteniendo siguiendo:", error);
              setSiguiendo(0);
            }
            console.log("Este usuario está siguiendo a: ", siguiendo);

            // Obtener si el usuario actual sigue al usuario que se está visualizando
            try {
              const sigoResponse = await axios.get(`http://localhost:3000/api/seguidores/${idUsuario}/${idUser}`);
              setSigo(sigoResponse.data);
            } catch (error) {
              console.error("Error obteniendo si sigo al usuario:", error);
              setSigo(false);
            }
            
            setCargando(false);
          } catch (error) {
            console.error("Error obteniendo datos:", error);
          }
        };
    
        fetchData();
    }, [idUser, idUsuario]);

    const handlePublicaciones = () => {
      // Navegar a las publicaciones del usuario que se está visualizando
      navigate("/PublicacionesOtroUsuario", { state: { idUser } });
    }

    const handleSeguir = async () => {
      // Seguir al usuario que se está visualizando
      const nuevoSeguimiento = {
        idSeguidor: idUsuario,
        idSeguido: idUser
      };
      try {
        await axios.post(`http://localhost:3000/api/seguidores/`, nuevoSeguimiento);
        setSigo(true);
        setSeguidores(seguidores + 1);
      } catch (error) {
        console.error('Error al seguir:', error);
      }
    }

    const handleDejarSeguir = async () => {
      // Dejar de seguir al usuario que se está visualizando
      try {
        await axios.delete(`http://localhost:3000/api/seguidores/${idUsuario}/${idUser}`);
        setSigo(false);
        setSeguidores(seguidores - 1);
      } catch (error) {
        console.error('Error al dejar de seguir:', error);
      }
    }

    if (cargando) { 
        return <h1>Cargando el perfil del usuario</h1>
    } else {
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }} >
      <h1 style={{ fontSize: "4vh", textAlign: "center" }}> {usuario.nickName} </h1>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <img src={usuario.fotoPerfil} alt="Foto de perfil" style={{ width: "15vh", height: "15vh", borderRadius: "50%", backgroundColor:"white"}} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <p style={{ fontSize: "3vh", marginLeft: "1vh", margin: "1vh" }}>{usuario.nombreCompleto}</p>
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
          {!sigo ? (
            <button type='submit' onClick={handleSeguir} style={{ fontSize: "2vh", height:"3vh", marginTop: "1vh", marginLeft:"1vw", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border: "none", backgroundColor:"#C40000", width:"15vw" }}>
              Seguir 
            </button>
          ) : (
            <button type='submit' onClick={handleDejarSeguir} style={{ fontSize: "2vh", height:"3vh", marginTop: "1vh", marginLeft:"1vw", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border: "none", backgroundColor:"white", width:"15vw", color:"#C40000" }}>
              Dejar de seguir
            </button>
          )}
        </div>
      </div>
      <br />
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <h2 style={{ backgroundColor: "#C40000", borderRadius:"0.5vh", width: "15vh", fontSize:"2vh", textAlign: "center", cursor:"pointer" }}>Datos</h2>
        <button type='submit' onClick={handlePublicaciones} style={{ fontSize: "2vh", height:"3vh", marginLeft: "35vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border: "none", backgroundColor:"#15151E" }}>Publicaciones</button>
      </div>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", paddingTop: "5vh" }}>
        <div style={{ width: "15vw", height: "25vh", borderRadius: "25px", backgroundColor:"#2c2c2c", display: "flex", justifyContent: "center", alignItems: "center" }} >
          <img src={imagenPiloto} alt="Piloto" style={{ width: "90%", height: "100%", objectFit:"contain" }} />
        </div>
        <div style={{ width: "40vh", height: "20vh", paddingLeft: "15vh", display: "flex", justifyContent: "center", alignItems: "center" }} >
          <img src={imagenEquipo} alt="Equipo" style={{ width: "90%", height: "100%", backgroundColor:"#2c2c2c", borderRadius: "25px", objectFit:"contain" }} />
        </div>
        <div style={{ width: "40vh", height: "25vh", paddingLeft: "15vh", display: "flex", justifyContent: "center", alignItems: "center" }} >
          <img src={imagenCircuito} alt="Circuito" style={{ width: "100%", height: "100%", backgroundColor:"#2c2c2c", borderRadius: "25px", objectFit:"contain" }} />
        </div>
      </div>
    </div> 
  )
}
}

export default OtroPerfil;