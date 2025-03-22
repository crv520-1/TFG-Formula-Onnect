import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";
import { getImagenCircuito, getImagenEquipo, getImagenPiloto } from './mapeoImagenes.js';
import { validarContraseña } from "./validarContraseña.js";

export const EditarPerfil = () => {
    const navigate = useNavigate();
    const { user: idUsuario } = useContext(UsuarioContext);
    const [usuario, setUsuario] = useState([]);
    const [pilotos, setPilotos] = useState([]);
    const [pilotoFav, setPilotoFav] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [equipoFav, setEquiposFav] = useState([]);
    const [circuitos, setCircuitos] = useState([]);
    const [circuitoFav, setCircuitoFav] = useState([]);
    const [pilotoSeleccionado, setPilotoSeleccionado] = useState("");
    const [equipoSeleccionado, setEquipoSeleccionado] = useState("");
    const [circuitoSeleccionado, setCircuitoSeleccionado] = useState("");
    const [nickName, setNickName] = useState("");
    const [nombreCompleto, setNombreCompleto] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [contraseñaRepe, setContraseñaRepe] = useState("");
    const [cargando, setCargando] = useState(true);
    const [imagenPiloto, setImagenPiloto] = useState("");
    const [imagenEquipo, setImagenEquipo] = useState("");
    const [imagenCircuito, setImagenCircuito] = useState("");
    const [tipo, setTipo] = useState("password");
    const [icono, setIcono] = useState(EyeSlashIcon);

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
            setNickName(usuarioEncontrado.nickName);
            setNombreCompleto(usuarioEncontrado.nombreCompleto);
            setContraseña(usuarioEncontrado.contrasena);
            setContraseñaRepe(usuarioEncontrado.contrasena);
    
            // Obtener piloto favorito
            const pilotosResponse = await axios.get("http://localhost:3000/api/pilotos");
            setPilotos(pilotosResponse.data);
            const pilFav = pilotosResponse.data.find(p => p.idPilotos === usuarioEncontrado.pilotoFav);
            setPilotoFav(pilFav);
            setPilotoSeleccionado(pilFav.idPilotos);
            if (pilFav) setImagenPiloto(getImagenPiloto(pilFav.driverId));
    
            // Obtener equipo favorito
            const equiposResponse = await axios.get("http://localhost:3000/api/equipos");
            setEquipos(equiposResponse.data);
            const equiFav = equiposResponse.data.find(e => e.idEquipos === usuarioEncontrado.equipoFav);
            setEquiposFav(equiFav);
            setEquipoSeleccionado(equiFav.idEquipos);
            if (equiFav) setImagenEquipo(getImagenEquipo(equiFav.constructorId));
    
            // Obtener circuito favorito
            const circuitosResponse = await axios.get("http://localhost:3000/api/circuitos");
            setCircuitos(circuitosResponse.data);
            const circuFav = circuitosResponse.data.find(c => c.idCircuitos === usuarioEncontrado.circuitoFav);
            setCircuitoFav(circuFav);
            setCircuitoSeleccionado(circuFav.idCircuitos);
            if (circuFav) setImagenCircuito(getImagenCircuito(circuFav.circuitId));
            setCargando(false);
          } catch (error) {
            console.error("Error obteniendo datos:", error);
          }
        };
        fetchData();
    }, [idUsuario]);

    const handleOcultarMostrar = () => {
        if (tipo==="password"){
            setIcono(EyeIcon);
            setTipo("text")
        } else {
            setIcono(EyeSlashIcon);
            setTipo('password')
        }
    }

    const handleCancelar = (e) => {
        e.preventDefault();
        navigate("/Perfil");
        console.log("Cancelar");
    }

    

    const handleGuardar = async (e) => {
        e.preventDefault();
        
        if (!nickName || !nombreCompleto || !contraseña || !contraseñaRepe) {
            alert("Por favor, llene todos los campos");
            return;
        } 
        
        if (!validarContraseña(contraseña)) {
            alert("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número");
            return;
        }

        if (contraseña !== contraseñaRepe) {
            alert("Las contraseñas no coinciden");
            return;
        }
                
        const usuarioActualizado = {
            nickName: nickName,
            nombreCompleto: nombreCompleto,
            email: usuario.email,
            contrasena: contraseña,
            pilotoFav: pilotoSeleccionado,
            equipoFav: equipoSeleccionado,
            circuitoFav: circuitoSeleccionado,
            fotoPerfil: usuario.fotoPerfil
        };
        console.log(usuarioActualizado);
        try {
            await axios.put(`http://localhost:3000/api/usuarios/${idUsuario}`, usuarioActualizado);
        } catch (error) {
            console.error(`Error al actualizar el usuario ${usuarioActualizado.nickName}:`, error);
        }
        navigate("/Perfil");
    }

    if (cargando) { 
        return <h1>Cargando el perfil del usuario</h1>
    } else {
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", paddingTop:"3vh" }} >
        <input style={{ fontSize: "4vh", textAlign: "center", borderRadius: "1.5vh", border: "2px solid white", backgroundColor: "#2c2c2c", color: "white" }} type="text" placeholder={usuario.nickName} value={nickName} onChange={(e) => setNickName(e.target.value)}/>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", paddingTop:"3vh" }}>
        <img src={usuario.fotoPerfil} alt="Foto de perfil" style={{ width: "15vh", height: "15vh", borderRadius: "50%", color:"white", backgroundColor:"white" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <input style={{ fontSize: "3vh", textAlign: "center", borderRadius: "1.5vh", border: "2px solid white", backgroundColor: "#2c2c2c", color: "white", marginLeft: "1vh", margin: "1vh" }} type="text" placeholder={usuario.nombreCompleto} value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)}/>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input style={{ fontSize: "3vh", borderRadius: "1.5vh", border: "2px solid white", backgroundColor: "#2c2c2c", color: "white", marginLeft: "1vh", margin: "1vh" }} type={tipo} placeholder="Contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)}/>
                <span style={{ position: "absolute", right: "2vh", top:"40%", cursor: "pointer" }} onClick={handleOcultarMostrar}>
                    {React.createElement(icono, { style: { width: "20px", height: "20px", color: "white" } })}
                </span>
            </div>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input style={{ fontSize: "3vh", borderRadius: "1.5vh", border: "2px solid white", backgroundColor: "#2c2c2c", color: "white", marginLeft: "1vh", margin: "1vh" }} type={tipo} placeholder="Contraseña Repetida" value={contraseñaRepe} onChange={(e) => setContraseñaRepe(e.target.value)}/>
                <span style={{ position: "absolute", right: "2vh", top:"40%", cursor: "pointer" }} onClick={handleOcultarMostrar}>
                    {React.createElement(icono, { style: { width: "20px", height: "20px", color: "white" } })}
                </span>
            </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", paddingTop: "5vh" }}>
        <div style={{width: "20vw", height: "25vh", borderRadius: "1.5vh", backgroundColor:"#2c2c2c", color: "black", marginRight: "5vw", alignItems: "center", display: "flex", flexDirection: "column"}}>
            <select style={{width: "20vw", background: "#2c2c2c", color: "white", border: 0, paddingTop: "0.5vh", borderRadius: "1.5vh"}} value={pilotoSeleccionado} onChange={(e) => setPilotoSeleccionado(e.target.value)} >
                {pilotos.map((piloto) => ( <option key={piloto.idPilotos} value={piloto.idPilotos}> {piloto.nombrePiloto} {piloto.apellidoPiloto} </option> ))}
            </select>
            {pilotoSeleccionado && (<img src={getImagenPiloto(pilotos.find(p => p.idPilotos === Number(pilotoSeleccionado))?.driverId)} alt="Piloto" style={{ width: "10vw", height: "25vh", paddingTop: "2vh" }} />)}
        </div>
        <div style={{width: "20vw", height: "25vh", borderRadius: "1.5vh", background: "#2c2c2c", color: "white", marginRight: "5vw", alignItems: "center", display: "flex", flexDirection: "column"}}>
            <select style={{width: "20vw", background: "#2c2c2c", color: "white", border: 0, paddingTop: "0.5vh", borderRadius: "1.5vh"}} value={equipoSeleccionado} onChange={(e) => setEquipoSeleccionado(e.target.value)} >
                {equipos.map((equipo) => ( <option key={equipo.idEquipos} value={equipo.idEquipos}> {equipo.nombreEquipo} </option> ))}
            </select>
            {equipoSeleccionado && (<img src={getImagenEquipo(equipos.find(p => p.idEquipos === Number(equipoSeleccionado))?.constructorId)} alt="Equipo" style={{ width: "19vw", height: "20vh", paddingTop: "2vh" }} />)}
        </div>
        <div style={{width: "20vw", height: "25vh", borderRadius: "1.5vh", background: "#2c2c2c", color: "white", marginRight: "5vw", alignItems: "center", display: "flex", flexDirection: "column"}}>
            <select style={{width: "20vw", background: "#2c2c2c", color: "white", border: 0, paddingTop: "0.5vh", borderRadius: "1.5vh"}} value={circuitoSeleccionado} onChange={(e) => setCircuitoSeleccionado(e.target.value)} >
                {circuitos.map((circuito) => ( <option key={circuito.idCircuitos} value={circuito.idCircuitos}> {circuito.nombreCircuito} </option> ))}
            </select>
            {circuitoSeleccionado && (<img src={getImagenCircuito(circuitos.find(p => p.idCircuitos === Number(circuitoSeleccionado))?.circuitId)} alt="Circuito" style={{ width: "20vw", height: "20vh", paddingTop: "2vh" }} />)}
        </div>
      </div>
      <div style={{ paddingTop: "5vh" }}>
        <button style={{color: "#EA1F22", backgroundColor: "white", borderRadius:"1.5vh", borderWidth: 3, borderColor: "#EA1F22", marginRight:"10vw" }} type="submit" onClick={handleCancelar}> Cancelar </button>
        <button style={{backgroundColor: "#EA1F22", borderRadius:"1.5vh", borderWidth: 3, borderColor: "White"}} type="submit" onClick={handleGuardar}> Guardar </button>
      </div>
    </div>
  )
}
}

export default EditarPerfil