import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Registro1.css';
import { carga } from './animacionCargando';
import { validarContraseña } from "./validarContraseña";
import { validarEmail } from "./validarEmail";

const Registro1 = () => {
    const [cargando, setCargando] = useState(true);
    const [usuarios, setUsuarios] = useState([]);
    const [nickName, setNickName] = useState("");
    const [nombreCompleto, setNombreCompleto] = useState("");
    const [email, setEmail] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [contraseñaRepe, setContraseñaRepe] = useState("");
    const [tipo, setTipo] = useState("password");
    const navigate = useNavigate();
    let logo = "images/logo/Posible4NOFondo.png";
    const [icono, setIcono] = useState(EyeSlashIcon);

    useEffect(() => {
        setCargando(true);
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

    const handleIniciarSesion = (e) => {
        e.preventDefault();
        navigate("/IniciarSesion");
    };

    if (cargando) { return carga(); }

    return (
        <div className="registro-container">
            <img src={logo} className="registro-logo" />
            <h1 className="registro-title">¡Bienvenido!</h1>
            <form className="registro-form">
                <div>
                    <input 
                        className="registro-input"
                        type="text"
                        placeholder="Nombre Usuario"
                        value={nickName}
                        onChange={(e) => setNickName(e.target.value)}
                    />
                </div>
                <br />
                <div>
                    <input 
                        className="registro-input"
                        type="text"
                        placeholder="Nombre Completo"
                        value={nombreCompleto}
                        onChange={(e) => setNombreCompleto(e.target.value)}
                    />
                </div>
                <br />
                <div>
                    <input 
                        className="registro-input"
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <br />
                <div className="password-container">
                    <input 
                        className="registro-input"
                        type={tipo}
                        placeholder="Contraseña"
                        value={contraseña}
                        onChange={(e) => setContraseña(e.target.value)}
                    />
                    <span className="password-toggle" onClick={handleOcultarMostrar}>
                        {React.createElement(icono, { className: "password-icon" })}
                    </span>
                </div>
                <br />
                <div className="password-container">
                    <input 
                        className="registro-input"
                        type={tipo}
                        placeholder="Repetir Contraseña"
                        value={contraseñaRepe}
                        onChange={(e) => setContraseñaRepe(e.target.value)}
                    />
                    <span className="password-toggle" onClick={handleOcultarMostrar}>
                        {React.createElement(icono, { className: "password-icon" })}
                    </span>
                </div>
                <br />
                <button className="continuar-button" type="submit" onClick={handleContinuarRegistro}>
                    Continuar
                </button>
            </form>
            <form className="login-section">
                <label className="login-text">¿Ya tienes cuenta?</label>
                <button className="login-button-registro" type="submit" onClick={handleIniciarSesion}>
                    Iniciar Sesión
                </button>
            </form>
        </div>
    );
};

export default Registro1;