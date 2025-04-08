import axios from "axios";
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";
import "../styles/Botones.css";
import "../styles/Containers.css";
import "../styles/PerfilDatos.css";
import { carga } from "./animacionCargando.jsx";
import HeaderPerfil from "./HeaderPerfil";
import { getImagenCircuito, getImagenEquipo, getImagenPiloto } from './mapeoImagenes.js';

export const Perfil = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { idUser } = location.state || {};
  const { user: idUsuario } = useContext(UsuarioContext);
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
    const cargarDatos = async () => {
      try {
        const usuariosResponse = await axios.get("http://localhost:3000/api/usuarios");
        const usuario = await cargarUsuario(usuariosResponse, idUser);
        setUsuario(usuario);
  
        const { pilotoFav, equipoFav, circuitoFav } = await cargarFavoritos(usuario);
        if (pilotoFav) setImagenPiloto(getImagenPiloto(pilotoFav.driverId));
        if (equipoFav) setImagenEquipo(getImagenEquipo(equipoFav.constructorId));
        if (circuitoFav) setImagenCircuito(getImagenCircuito(circuitoFav.circuitId));
  
        const publicacionesResponse = await axios.get(`http://localhost:3000/api/publicaciones/count/${idUser}`);
        setNumeroPublicaciones(publicacionesResponse.data["COUNT(*)"]);
  
        const { seguidores, siguiendo } = await cargarSeguidores(idUser);
        setSeguidores(seguidores);
        setSiguiendo(siguiendo);
  
        const { mismoUsuario, sigo } = await verificarSeguimiento(idUser, idUsuario);
        setMismoUsuario(mismoUsuario);
        setSigo(sigo);
  
        setTimeout(() => { setCargando(false); }, 500);
      } catch (error) {
        console.error("Error obteniendo datos:", error);
      }
    };
  
    cargarDatos();
  }, [idUser, idUsuario]);

  const cargarUsuario = async (usuariosResponse, idUser) => {
    const usuarioEncontrado = usuariosResponse.data.find(user => user.idUsuario === idUser);
    if (!usuarioEncontrado) {
      throw new Error("Usuario no encontrado");
    }
    return usuarioEncontrado;
  };
  
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

  const handlePublicaciones = (e) => {
    e.preventDefault();
    navigate("/PerfilPublicaciones", { state: { idUser } });
  }

  const handleSeguidoresChange = (nuevoNumeroSeguidores, nuevoEstadoSigo) => {
    setSeguidores(nuevoNumeroSeguidores);
    setSigo(nuevoEstadoSigo);
  };

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
      <div className="container_fila">
        <h2 className="textoDireccion">Datos</h2>
        <button type='submit' onClick={handlePublicaciones} className="boton_fondo_15_v2">Publicaciones</button>
      </div>
      <div className="container_fila_paddingTop">
        <div className="container_espacioPiloto">
          <img src={imagenPiloto} alt="Piloto" className="imagen"/>
        </div>
        <div className="container_espacioCircuito">
          <img src={imagenCircuito} alt="Circuito" className="imagenCircuito"/>
        </div>
        <div className="container_espacioEquipo">
          <img src={imagenEquipo} alt="Equipo" className="imagenEquipo"/>
        </div>
      </div>
    </div> 
  )
}

export default Perfil;