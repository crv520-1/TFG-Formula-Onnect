import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";
import { carga } from './animacionCargando.jsx';
import { getImagenCircuito, getImagenEquipo, getImagenPiloto } from './mapeoImagenes.js';

export const RegistroNext = () => {
    let logo = "images/logo/Posible4NOFondo.png";
    let newUsuario = [];
    const [pilotos, setPilotos] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [circuitos, setCircuitos] = useState([]);
    const [pilotoSeleccionado, setPilotoSeleccionado] = useState("");
    const [equipoSeleccionado, setEquipoSeleccionado] = useState("");
    const [circuitoSeleccionado, setCircuitoSeleccionado] = useState("");
    const location = useLocation();
    const { nickName, nombreCompleto, email, contraseña } = location.state || {};
    const { setUser } = useContext(UsuarioContext);
    const navigate = useNavigate();
    const [cargando, setCargando] = useState(true);
    
    useEffect(() => {
        setCargando(true);
        axios.get("http://localhost:3000/api/pilotos").then(response => {
            setPilotos(response.data);
            setPilotoSeleccionado(response.data[0].idPilotos);
        }).catch(error => {
            console.error("Error al obtener los pilotos:", error);
        });
        axios.get("http://localhost:3000/api/equipos").then(response => {
            setEquipos(response.data);
            setEquipoSeleccionado(response.data[0].idEquipos);
        }).catch(error => {
            console.error("Error al obtener los equipos:", error);
        });
        axios.get("http://localhost:3000/api/circuitos").then(response => {
            setCircuitos(response.data);
            setCircuitoSeleccionado(response.data[0].idCircuitos);
        }).catch(error => {
            console.error("Error al obtener los circuitos:", error);
        });
        setTimeout(() => {
            setCargando(false);
        }, 500);
    }, []);

    const handleCrearCuenta = async (e) => {
        e.preventDefault();
        newUsuario = {
            nickName: nickName,
            nombreCompleto: nombreCompleto,
            email: email,
            contrasena: contraseña,
            pilotoFav: pilotoSeleccionado,
            equipoFav: equipoSeleccionado,
            circuitoFav: circuitoSeleccionado,
            fotoPerfil: "images/fotoPerfil/default.png"
        };
        try {
            const response = await axios.post("http://localhost:3000/api/usuarios", newUsuario);
            if (response.data && response.data.id) {
                setUser(response.data.id);
                navigate("/Inicio");
            } else {
                console.error("Error al crear la cuenta: respuesta inválida");
            }
        } catch (error) {
            console.error(`Error al almacenar el usuario ${newUsuario.nickName}:`, error);
        }
    };

    if (cargando) { return carga() };

    return (
        <div style={{display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", height: "95vh", width: "100vw", paddingTop: "50px", backgroundColor: "#D9D9D9", color: "white" }}>
            <img src={logo} style={{ width: "15vw", height: "15vh", objectFit:"contain" }} />
            <div style={{color: "black", paddingTop: "7vh", alignItems: "center", display: "flex", flexDirection: "column"}}>
                <h1>¡Bienvenido nickName!</h1>
                <h1>Seleccione a su piloto, equipo y circuito favorito</h1>
            </div>
            <form style={{display: 'flex', flexDirection: 'row'}}>
                <div style={{width: "25vw", height: "25vh", borderRadius: "1.5vh", background: "white", color: "black", marginRight: "5vw", alignItems: "center", display: "flex", flexDirection: "column"}}>
                    <select style={{width: "25vw", background: "white", color: "black", border: 0, paddingTop: "0.5vh", borderRadius: "1.5vh"}} value={pilotoSeleccionado} onChange={(e) => setPilotoSeleccionado(e.target.value)} >
                        {pilotos.map((piloto) => ( <option key={piloto.idPilotos} value={piloto.idPilotos}> {piloto.nombrePiloto} {piloto.apellidoPiloto} </option> ))}
                    </select>
                    {pilotoSeleccionado && (<img src={getImagenPiloto(pilotos.find(p => p.idPilotos === Number(pilotoSeleccionado))?.driverId)} alt="Piloto" style={{ width: "10vw", height: "20vh", paddingTop: "2vh", objectFit:"contain" }} />)}
                </div>
                <div style={{width: "25vw", height: "25vh", borderRadius: "1.5vh", background: "white", color: "black", marginRight: "5vw", alignItems: "center", display: "flex", flexDirection: "column"}}>
                    <select style={{width: "25vw", background: "white", color: "black", border: 0, paddingTop: "0.5vh", borderRadius: "1.5vh"}} value={equipoSeleccionado} onChange={(e) => setEquipoSeleccionado(e.target.value)} >
                        {equipos.map((equipo) => ( <option key={equipo.idEquipos} value={equipo.idEquipos}> {equipo.nombreEquipo} </option> ))}
                    </select>
                    {equipoSeleccionado && (<img src={getImagenEquipo(equipos.find(p => p.idEquipos === Number(equipoSeleccionado))?.constructorId)} alt="Equipo" style={{ width: "20vw", height: "20vh", paddingTop: "2vh", objectFit:"contain" }} />)}
                </div>
                <div style={{width: "25vw", height: "25vh", borderRadius: "1.5vh", background: "white", color: "black", marginRight: "5vw", alignItems: "center", display: "flex", flexDirection: "column"}}>
                    <select style={{width: "25vw", background: "white", color: "black", border: 0, paddingTop: "0.5vh", borderRadius: "1.5vh"}} value={circuitoSeleccionado} onChange={(e) => setCircuitoSeleccionado(e.target.value)} >
                        {circuitos.map((circuito) => ( <option key={circuito.idCircuitos} value={circuito.idCircuitos}> {circuito.nombreCircuito} </option> ))}
                    </select>
                    {circuitoSeleccionado && (<img src={getImagenCircuito(circuitos.find(p => p.idCircuitos === Number(circuitoSeleccionado))?.circuitId)} alt="Circuito" style={{ width: "20vw", height: "20vh", paddingTop: "2vh", objectFit:"contain" }} />)}
                </div>
            </form>
            <br />
            <button style={{width: "50vw", backgroundColor: "#EA1F22", borderRadius:"1.5vh", borderWidth: 3, borderColor: "White"}} type="submit" onClick={handleCrearCuenta}>Crear Cuenta</button>
        </div>
    );
};

export default RegistroNext;