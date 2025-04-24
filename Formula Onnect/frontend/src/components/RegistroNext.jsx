import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";
import '../styles/Iniciar_Registrar.css';
import '../styles/RegistroNext.css';
import { carga } from './animacionCargando.jsx';

/**
 * Componente que muestra el segundo paso del registro de usuario
 * Permite seleccionar favoritos (piloto, equipo, circuito) antes de crear la cuenta
 */
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
    
    // Contexto para establecer el usuario actual tras el registro
    const { setUser } = useContext(UsuarioContext);
    const navigate = useNavigate();
    const [cargando, setCargando] = useState(true);
    
    /**
     * Carga las opciones de pilotos, equipos y circuitos al iniciar el componente
     * Establece las opciones por defecto
     */
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
        setTimeout(() => { setCargando(false); }, 100);
    }, []);

    /**
     * Función para crear la cuenta con todos los datos recopilados
     * Envía la información al servidor y navega al inicio si es exitoso
     * @param {Event} e - Evento del formulario
     */
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

    // Muestra animación de carga mientras se obtienen los datos
    if (cargando) { return carga() };

    return (
        <div className="container">
            <img src={logo} className="logo" />
            <div className="header-container">
                <h1>¡Bienvenido {nickName}!</h1>
                <h2>Seleccione a su piloto, equipo y circuito favorito</h2>
            </div>
            <form className="seleccion-form">
                <div className="selector-container">
                    <select className="selector" value={pilotoSeleccionado} onChange={(e) => setPilotoSeleccionado(e.target.value)}>
                        {pilotos.map((piloto) => (
                            <option key={piloto.idPilotos} value={piloto.idPilotos}>
                                {piloto.nombrePiloto} {piloto.apellidoPiloto}
                            </option>
                        ))}
                    </select>
                    {pilotoSeleccionado && (
                        (() => {
                            const piloto = pilotos.find(p => p.idPilotos === Number(pilotoSeleccionado));
                            return piloto ? <img src={piloto.imagenPilotos} alt="Piloto" className="piloto-imagen"/> : null;
                        })()
                    )}
                </div>
                <div className="selector-container">
                    <select className="selector" value={equipoSeleccionado} onChange={(e) => setEquipoSeleccionado(e.target.value)}>
                        {equipos.map((equipo) => (
                            <option key={equipo.idEquipos} value={equipo.idEquipos}>
                                {equipo.nombreEquipo}
                            </option>
                        ))}
                    </select>
                    {equipoSeleccionado && (
                        (() => {
                            const equipo = equipos.find(p => p.idEquipos === Number(equipoSeleccionado));
                            return equipo ? <img src={equipo.imagenEquipos} alt="Equipo" className="equipo-imagen"/> : null;
                        })()
                    )}
                </div>
                <div className="selector-container">
                    <select className="selector" value={circuitoSeleccionado} onChange={(e) => setCircuitoSeleccionado(e.target.value)}>
                        {circuitos.map((circuito) => (
                            <option key={circuito.idCircuitos} value={circuito.idCircuitos}>
                                {circuito.nombreCircuito}
                            </option>
                        ))}
                    </select>
                    {circuitoSeleccionado && (
                        (() => {
                            const circuito = circuitos.find(p => p.idCircuitos === Number(circuitoSeleccionado));
                            return circuito ? <img src={circuito.imagenCircuitos} alt="Circuito" className="circuito-imagen"/> : null;
                        })()
                    )}
                </div>
            </form>
            <br />
            <button className="principal-button" type="submit" onClick={handleCrearCuenta}>
                Crear Cuenta
            </button>
        </div>
    );
};

export default RegistroNext;