import axios from "axios";
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";
import { getImagenCircuito, getImagenEquipo, getImagenPiloto } from './mapeoImagenes.js';
import PerfilHeader from './PerfilHeader';

export const Perfil = () => {
  const navigate = useNavigate();
  const { user: idUsuario } = useContext(UsuarioContext);
  const [usuario, setUsuario] = useState([]);
  const [seguidores, setSeguidores] = useState([]);
  const [siguiendo, setSiguiendo] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [imagenPiloto, setImagenPiloto] = useState("");
  const [imagenEquipo, setImagenEquipo] = useState("");
  const [imagenCircuito, setImagenCircuito] = useState("");
  const [numeroPublicaciones, setNumeroPublicaciones] = useState(0);

  console.log(idUsuario);

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

        // Obtener piloto favorito
        const pilotosResponse = await axios.get("http://localhost:3000/api/pilotos");
        const pilotoFav = pilotosResponse.data.find(p => p.idPilotos === usuarioEncontrado.pilotoFav);
        if (pilotoFav) setImagenPiloto(getImagenPiloto(pilotoFav.driverId));

        // Obtener equipo favorito
        const equiposResponse = await axios.get("http://localhost:3000/api/equipos");
        const equipoFav = equiposResponse.data.find(e => e.idEquipos === usuarioEncontrado.equipoFav);
        if (equipoFav) setImagenEquipo(getImagenEquipo(equipoFav.constructorId));

        // Obtener circuito favorito
        const circuitosResponse = await axios.get("http://localhost:3000/api/circuitos");
        const circuitoFav = circuitosResponse.data.find(c => c.idCircuitos === usuarioEncontrado.circuitoFav);
        if (circuitoFav) setImagenCircuito(getImagenCircuito(circuitoFav.circuitId));

        // Obtener número de publicaciones del usuario
        const numeroPublicacionesResponse = await axios.get(`http://localhost:3000/api/publicaciones/count/${idUsuario}`);
        const numeroPublicacionesUsuario = numeroPublicacionesResponse.data;
        if (!numeroPublicacionesUsuario) {
          console.error("Número de publicaciones no encontrado");
          return;
        }
        setNumeroPublicaciones(numeroPublicacionesUsuario["COUNT(*)"]);

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
      }
    };

    fetchData();
  }, [idUsuario]);

  const handlePublicaciones = (e) => {
    e.preventDefault();
    navigate("/PerfilPublicaciones");
    console.log("Publicaciones");
  }

  if (cargando) { 
    return <h1>Cargando el perfil del usuario</h1>
  } else {

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }} >
      <PerfilHeader usuario={usuario} numeroPublicaciones={numeroPublicaciones} seguidores={seguidores} siguiendo={siguiendo} />
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

export default Perfil;