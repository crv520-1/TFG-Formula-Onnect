import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
        <div style={{display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", backgroundColor: "#D9D9D9" }}>
            <img src={logo} style={{ width: "15vw", height: "15vh", objectFit:"contain" }} />
            <h1 style={{color: "black", paddingTop: "7vh", fontSize:"6vh"}}>¡Bienvenido!</h1>
            <form style={{display: 'flex', flexDirection: 'column'}}>
                <div>
                    <input style={{width: "50vw", height: "3.5vh", backgroundColor: "white", borderRadius:"1.5vh", borderWidth:0 ,color: "black"}} type="text" placeholder="Nombre Usuario" value={nickName} onChange={(e) => setNickName(e.target.value)}/>
                </div>
                <br />
                <div>
                    <input style={{width: "50vw", height: "3.5vh", backgroundColor: "white", borderRadius:"1.5vh", borderWidth:0 ,color: "black"}} type="text" placeholder="Nombre Completo" value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)}/>
                </div>
                <br />
                <div>
                    <input style={{width: "50vw", height: "3.5vh", backgroundColor: "white", borderRadius:"1.5vh", borderWidth:0 ,color: "black"}} type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <br />
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <input style={{width: "50vw", height: "3.5vh", backgroundColor: "white", borderRadius:"1.5vh", borderWidth:0 ,color: "black"}} type={tipo} placeholder="Contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)}/>
                    <span style={{ position: "absolute", right: "10px", top:"30%", cursor: "pointer" }} onClick={handleOcultarMostrar}>
                        {React.createElement(icono, { style: { width: "20px", height: "20px", color: "black" } })}
                    </span>
                </div>
                <br />
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <input style={{width: "50vw", height: "3.5vh", backgroundColor: "white", borderRadius:"1.5vh", borderWidth:0 ,color: "black"}} type={tipo} placeholder="Repetir Contraseña" value={contraseñaRepe} onChange={(e) => setContraseñaRepe(e.target.value)}/>
                    <span style={{ position: "absolute", right: "10px", top:"30%", cursor: "pointer" }} onClick={handleOcultarMostrar}>
                        {React.createElement(icono, { style: { width: "20px", height: "20px", color: "black" } })}
                    </span>
                </div>
                <br />
                <button style={{backgroundColor: "#EA1F22", borderRadius:"1.5vh", borderWidth: 3, borderColor: "White"}} type="submit" onClick={handleContinuarRegistro}>Continuar</button>
            </form>
            <form style={{display: 'flex', flexDirection: 'column', paddingTop: "10vh"}}>
                <label style={{color: "black", fontSize: "3vh"}}>¿Ya tienes cuenta?</label>
                <button style={{color: "#EA1F22", backgroundColor: "white", borderRadius:"1.5vh", borderWidth: 3, borderColor: "#EA1F22"}} type="submit" onClick={handleIniciarSesion}>Iniciar Sesión</button>
            </form>
        </div>
    );
};

export default Registro1;