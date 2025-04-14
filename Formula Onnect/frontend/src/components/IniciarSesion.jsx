import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";
import '../styles/Iniciar_Registrar.css';
import '../styles/IniciarSesion.css';
import { carga } from "./animacionCargando";

/**
 * Componente que muestra el formulario de inicio de sesión
 * Permite a los usuarios autenticarse para acceder a la aplicación
 */
export const IniciarSesion = () => {
    const [cargando, setCargando] = useState(true);
    const [usuarios, setUsuarios] = useState([]);
    const [nickName, setNickName] = useState("");
    const [contraseña, setContraseña] = useState("");
    
    // Estados para controlar la visibilidad de la contraseña
    const [tipo, setTipo] = useState("password");
    const [icono, setIcono] = useState(EyeSlashIcon);
    
    // Contexto para mantener la sesión del usuario
    const { setUser } = useContext(UsuarioContext);
    const navigate = useNavigate();
    let logo = "images/logo/Posible4NOFondo.png";

    /**
     * Carga la lista de usuarios al iniciar el componente
     * Necesario para validar las credenciales de inicio de sesión
     */
    useEffect(() => {
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
     * Función para navegar al formulario de registro
     */
    const handleCrearCuenta = (e) => {
        e.preventDefault();
        navigate("/Registro1");
    };

    /**
     * Función para validar credenciales e iniciar sesión
     * Verifica que el usuario exista y que la contraseña coincida
     */
    const handleIniciarSesion = async (e) => {
        e.preventDefault();
        // Implementar lógica de inicio de sesión
        if (!nickName || !contraseña) {
            alert("Por favor, llene todos los campos");
            return;
        }
        let usuario = usuarios.find(usuario => usuario.nickName === nickName);
        if (!usuario) {
            alert("Usuario no encontrado o inexistente");
            return;
        }
        if (usuario.contrasena !== contraseña) {
            alert("Contraseña incorrecta");
            return;
        }
        setUser(usuario.idUsuario);
        navigate("/Inicio");
    };

    // Muestra animación de carga mientras se obtienen los datos
    if (cargando) { return carga() };

    return (
        <div className="container">
            <img src={logo} className="logo" />
            <h1 className="title">¡Bienvenido de vuelta!</h1>
            <form className="form">
                <div>
                    <input 
                        className="login-input"
                        type="text"
                        placeholder="Nombre Usuario"
                        value={nickName}
                        onChange={(e) => setNickName(e.target.value)}
                    />
                </div>
                <br />
                <div className="password-container">
                    <input className="login-input" type={tipo} placeholder="Contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)}/>
                    <span className="password-toggle" onClick={handleOcultarMostrar}>
                        {React.createElement(icono, { className: "password-icon" })}
                    </span>
                </div>
                <br />
                <button className="principal-button" type="submit" onClick={handleIniciarSesion}>
                    Iniciar Sesión
                </button>
            </form>
            <form className="register-form">
                <label className="text-change-view">¿No tienes cuenta?</label>
                <button className="secondary-button" type="submit" onClick={handleCrearCuenta}>
                    Crear Cuenta
                </button>
            </form>
        </div>
    )
}

export default IniciarSesion;