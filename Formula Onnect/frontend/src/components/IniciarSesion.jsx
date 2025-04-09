import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";
import '../styles/Iniciar_Registrar.css';
import '../styles/IniciarSesion.css';
import { carga } from "./animacionCargando";

export const IniciarSesion = () => {
    const [cargando, setCargando] = useState(true);
    const [usuarios, setUsuarios] = useState([]);
    const [nickName, setNickName] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [tipo, setTipo] = useState("password");
    const [icono, setIcono] = useState(EyeSlashIcon);
    const { setUser } = useContext(UsuarioContext);
    const navigate = useNavigate();
    let logo = "images/logo/Posible4NOFondo.png";

    useEffect(() => {
        axios.get("http://localhost:3000/api/usuarios").then(response => {
            setUsuarios(response.data);
        }).catch(error => {
            console.error("Error al obtener los usuarios:", error);
        });
        setCargando(false);
    }, []);

    const handleOcultarMostrar = () => {
        if (tipo==="password"){
           setIcono(EyeIcon);
           setTipo("text")
        } else {
           setIcono(EyeSlashIcon);
           setTipo('password')
        }
     }

    const handleCrearCuenta = (e) => {
        e.preventDefault();
        navigate("/Registro1");
    };

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

    if (cargando) { return carga() };

    return (
        <div className="container">
            <img src={logo} className="registro-logo" />
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