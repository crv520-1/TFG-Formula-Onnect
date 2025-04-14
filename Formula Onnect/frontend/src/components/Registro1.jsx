import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Iniciar_Registrar.css';
import '../styles/Registro1.css';
import { carga } from './animacionCargando';
import { validarContraseña } from "./validarContraseña";
import { validarEmail } from "./validarEmail";

/**
 * Componente que muestra el primer paso del formulario de registro
 * Recoge información básica del usuario y valida los datos antes de continuar
 */
const Registro1 = () => {
    const [cargando, setCargando] = useState(true);
    const [usuarios, setUsuarios] = useState([]);
    const [nickName, setNickName] = useState("");
    const [nombreCompleto, setNombreCompleto] = useState("");
    const [email, setEmail] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [contraseñaRepe, setContraseñaRepe] = useState("");
    
    // Estados para controlar la visibilidad de la contraseña
    const [tipo, setTipo] = useState("password");
    const [icono, setIcono] = useState(EyeSlashIcon);
    
    const navigate = useNavigate();
    let logo = "images/logo/Posible4NOFondo.png";

    /**
     * Carga la lista de usuarios al iniciar el componente
     * Necesario para verificar si el usuario ya existe
     */
    useEffect(() => {
        setCargando(true);
        axios.get("http://localhost:3000/api/usuarios").then(response => {
            setUsuarios(response.data);
        }).catch(error => {
            console.error("Error al obtener los usuarios:", error);
        });
        setCargando(false);
    }, []);

    /**
     * Función para alternar entre mostrar y ocultar la contraseña
     * Cambia el tipo de input y el icono correspondiente
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
     * Función para validar los datos y continuar al siguiente paso del registro
     * Verifica que todos los campos estén llenos y sean correctos
     * @param {Event} e - Evento del formulario
     */
    const handleContinuarRegistro = (e) => {
        e.preventDefault();
    
        if (!nickName || !nombreCompleto || !email || !contraseña || !contraseñaRepe) {
            alert("Por favor, llene todos los campos.");
            return;
        }

        if (!validarEmail(email)) {
            alert("Por favor, ingrese un email válido.");
            return;
        }
    
        if (contraseña !== contraseñaRepe) {
            alert("Las contraseñas no coinciden.");
            return;
        }
    
        if (!validarContraseña(contraseña)) {
            alert("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.");
            return;
        }
    
        const usuarioExistente = usuarios.find(user => user.nickName === nickName);
        const emailExistente = usuarios.find(user => user.email === email);
    
        if (usuarioExistente) {
            alert("El nombre de usuario ya existe.");
            return;
        }
    
        if (emailExistente) {
            alert("El email ya está registrado.");
            return;
        }
        navigate("/RegistroNext", { state: { nickName, nombreCompleto, email, contraseña } });
    };

    /**
     * Función para navegar a la pantalla de inicio de sesión
     * @param {Event} e - Evento del botón
     */
    const handleIniciarSesion = (e) => {
        e.preventDefault();
        navigate("/IniciarSesion");
    };

    // Muestra animación de carga mientras se obtienen los datos
    if (cargando) { return carga(); }

    return (
        <div className="container">
            <img src={logo} className="logo" />
            <h1 className="title">¡Bienvenido!</h1>
            <form className="form">
                <div>
                    <input className="registro-input" type="text" placeholder="Nombre Usuario" value={nickName} onChange={(e) => setNickName(e.target.value)}/>
                </div>
                <br />
                <div>
                    <input className="registro-input" type="text" placeholder="Nombre Completo" value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)}/>
                </div>
                <br />
                <div>
                    <input className="registro-input" type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <br />
                <div className="password-container">
                    <input className="registro-input" type={tipo} placeholder="Contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)}/>
                    <span className="password-toggle" onClick={handleOcultarMostrar}>
                        {React.createElement(icono, { className: "password-icon" })}
                    </span>
                </div>
                <br />
                <div className="password-container">
                    <input className="registro-input" type={tipo} placeholder="Repetir Contraseña" value={contraseñaRepe} onChange={(e) => setContraseñaRepe(e.target.value)}/>
                    <span className="password-toggle" onClick={handleOcultarMostrar}>
                        {React.createElement(icono, { className: "password-icon" })}
                    </span>
                </div>
                <br />
                <button className="principal-button" type="submit" onClick={handleContinuarRegistro}>
                    Continuar
                </button>
            </form>
            <form className="login-section">
                <label className="text-change-view">¿Ya tienes cuenta?</label>
                <button className="secondary-button" type="submit" onClick={handleIniciarSesion}>
                    Iniciar Sesión
                </button>
            </form>
        </div>
    );
};

export default Registro1;