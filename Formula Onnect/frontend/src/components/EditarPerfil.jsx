import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";
import "../styles/Containers.css";
import { carga } from './animacionCargando';
import { validarContraseña } from "./validarContraseña.js";

/**
 * Componente para editar el perfil del usuario
 * Permite modificar datos personales y seleccionar favoritos (pilotos, equipos, circuitos)
 */
export const EditarPerfil = () => {
    const navigate = useNavigate();
    const { user: idUsuario } = useContext(UsuarioContext);
    
    // Estados para almacenar datos de usuario y opciones de selección
    const [usuario, setUsuario] = useState([]);
    const [pilotos, setPilotos] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [circuitos, setCircuitos] = useState([]);
    
    // Estados para almacenar selecciones de favoritos
    const [pilotoSeleccionado, setPilotoSeleccionado] = useState("");
    const [equipoSeleccionado, setEquipoSeleccionado] = useState("");
    const [circuitoSeleccionado, setCircuitoSeleccionado] = useState("");
    
    // Estados para almacenar datos del formulario
    const [nickName, setNickName] = useState("");
    const [nombreCompleto, setNombreCompleto] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [contraseñaRepe, setContraseñaRepe] = useState("");
    
    // Estados para el control de visibilidad de contraseña
    const [tipo, setTipo] = useState("password");
    const [cargando, setCargando] = useState(true);
    const [icono, setIcono] = useState(EyeSlashIcon);

    useEffect(() => {
        /**
         * Función que carga los datos del usuario y las opciones para favoritos
         */
        const cargarDatos = async () => {
            try {
                const [usuarioEncontrado, datosFavoritos] = await Promise.all([
                    cargarDatosUsuario(idUsuario),
                    cargarDatosFavoritos()
                ]);

                setUsuario(usuarioEncontrado);
                setNickName(usuarioEncontrado.nickName);
                setNombreCompleto(usuarioEncontrado.nombreCompleto);
                setContraseña(usuarioEncontrado.contrasena);
                setContraseñaRepe(usuarioEncontrado.contrasena);

                // Actualizar listas de selección
                setPilotos(datosFavoritos.pilotos);
                setEquipos(datosFavoritos.equipos);
                setCircuitos(datosFavoritos.circuitos);

                // Establecer selecciones actuales
                setPilotoSeleccionado(usuarioEncontrado.pilotoFav?.toString() || "");
                setEquipoSeleccionado(usuarioEncontrado.equipoFav?.toString() || "");
                setCircuitoSeleccionado(usuarioEncontrado.circuitoFav?.toString() || "");
            } catch (error) {
                console.error("Error obteniendo datos:", error);
            }
            // Pequeño delay para mostrar la animación de carga
            setTimeout(() => { setCargando(false); }, 500);
        };
        cargarDatos();
    }, [idUsuario]);

    /**
     * Función para cargar los datos del usuario actual
     * @returns {Object} Datos del usuario
     */
    const cargarDatosUsuario = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/usuarios/${idUsuario}`);
            const usuarioData = response.data;
            return usuarioData;
        } catch (error) {
            console.error("Error al cargar los datos del usuario:", error);
            return null;
        }
    };

    /**
     * Función para cargar los datos de pilotos, equipos y circuitos
     * @returns {Object} Objeto con arrays de pilotos, equipos y circuitos
     */
    const cargarDatosFavoritos = async () => {
        const [pilotosRes, equiposRes, circuitosRes] = await Promise.all([
            axios.get("http://localhost:3000/api/pilotos"),
            axios.get("http://localhost:3000/api/equipos"),
            axios.get("http://localhost:3000/api/circuitos")
        ]);
        return {
            pilotos: pilotosRes.data,
            equipos: equiposRes.data,
            circuitos: circuitosRes.data
        };
    };

    /**
     * Función para alternar la visibilidad de la contraseña
     */
    const handleOcultarMostrar = () => {
        if (tipo==="password"){
            setIcono(EyeIcon);
            setTipo("text")
        } else {
            setIcono(EyeSlashIcon);
            setTipo('password')
        }
    }

    /**
     * Función para cancelar la edición y volver al perfil
     */
    const handleCancelar = (e) => {
        e.preventDefault();
        navigate("/Perfil", { state: { idUser: idUsuario } });
    }

    /**
     * Función para guardar los cambios del perfil
     * Valida los datos antes de enviarlos al servidor
     */
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
        try {
            await axios.put(`http://localhost:3000/api/usuarios/${idUsuario}`, usuarioActualizado);
        } catch (error) {
            console.error(`Error al actualizar el usuario ${usuarioActualizado.nickName}:`, error);
        }
        navigate("/Perfil", { state: { idUser: idUsuario } });
    }

    // Muestra animación de carga mientras se obtienen los datos
    if (cargando) { return carga()}

  return (
    <div className="container_columna_paddingTop">
      <input className="input_v1" type="text" placeholder={usuario.nickName} value={nickName} onChange={(e) => setNickName(e.target.value)}/>
      <div className="container_fila_paddingTop_v3">
        <img src={usuario.fotoPerfil} alt="Foto de perfil" className="imagen_perfil_v2"/>
        <div className="container_columna">
            <input className="input" type="text" placeholder={usuario.nombreCompleto} value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)}/>
            <div className="container_relative">
                <input className="input_v2" type={tipo} placeholder="Contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)}/>
                <span className="span_absolute" onClick={handleOcultarMostrar}>
                    {React.createElement(icono, { style: { width: "20px", height: "20px", color: "white" } })}
                </span>
            </div>
            <div className="container_relative">
                <input className="input_v2" type={tipo} placeholder="Contraseña Repetida" value={contraseñaRepe} onChange={(e) => setContraseñaRepe(e.target.value)}/>
                <span className="span_absolute" onClick={handleOcultarMostrar}>
                    {React.createElement(icono, { style: { width: "20px", height: "20px", color: "white" } })}
                </span>
            </div>
        </div>
      </div>
      <div className="container_fila_paddingTop_v4">
        <div className="container_columna_completo">
            <p className="datos_informativos"> Piloto Favorito </p>
            <select className="select_v2" value={pilotoSeleccionado} onChange={(e) => setPilotoSeleccionado(e.target.value)} >
                {pilotos.map((piloto) => ( <option key={piloto.idPilotos} value={piloto.idPilotos}> {piloto.nombrePiloto} {piloto.apellidoPiloto} </option> ))}
            </select>
            {pilotoSeleccionado && (
                (() => {
                    const piloto = pilotos.find(p => p.idPilotos === Number(pilotoSeleccionado));
                    return piloto ? <img src={piloto.imagenPilotos} alt="Piloto" className="imagen_piloto_select"/> : null;
                })()
            )}
        </div>
        <div className="container_columna_completo_v3">
            <p className="datos_informativos"> Circuito Favorito </p>
            <select className="select_v3" value={circuitoSeleccionado} onChange={(e) => setCircuitoSeleccionado(e.target.value)} >
                {circuitos.map((circuito) => ( <option key={circuito.idCircuitos} value={circuito.idCircuitos}> {circuito.nombreCircuito} </option> ))}
            </select>
            {circuitoSeleccionado && (
                (() => {
                    const circuito = circuitos.find(p => p.idCircuitos === Number(circuitoSeleccionado));
                    return circuito ? <img src={circuito.imagenCircuitos} alt="Circuito" className="imagen_circuito_select"/> : null;
                })()
            )}
        </div>
        <div className="container_columna_completo">
            <p className="datos_informativos"> Equipo Favorito </p>
            <select className="select_v2" value={equipoSeleccionado} onChange={(e) => setEquipoSeleccionado(e.target.value)} >
                {equipos.map((equipo) => ( <option key={equipo.idEquipos} value={equipo.idEquipos}> {equipo.nombreEquipo} </option> ))}
            </select>
            {equipoSeleccionado && (
                (() => {
                    const equipo = equipos.find(p => p.idEquipos === Number(equipoSeleccionado));
                    return equipo ? <img src={equipo.imagenEquipos} alt="Equipo" className="imagen_equipo_select"/> : null;
                })()
            )}
        </div>
      </div>
      <div className="container_paddingTop">
        <button className="boton_texto_ea" type="submit" onClick={handleCancelar}> Cancelar </button>
        <button className="boton_fondo_ea" type="submit" onClick={handleGuardar}> Guardar </button>
      </div>
    </div>
  )
}

export default EditarPerfil