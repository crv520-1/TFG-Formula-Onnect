import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";

export const IniciarSesion = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [nickName, setNickName] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [tipo, setTipo] = useState("password");
    const [icono, setIcono] = useState(EyeSlashIcon);
    const navigate = useNavigate();
    let logo = "images/logo/logoApp.png";
    const { setUser } = useContext(UsuarioContext);

    useEffect(() => {
        axios.get("http://localhost:3000/api/usuarios").then(response => {
            setUsuarios(response.data);
        }).catch(error => {
            console.error("Error al obtener los usuarios:", error);
        });
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
        console.log("Crear cuenta");
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
        console.log("Usuario:", usuario);
        setUser(usuario.idUsuario);
        navigate("/Inicio");
        console.log("Iniciar sesión");
    };

return (
    <div style={{display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", height: "95vh", width: "100vw", paddingTop: "50px", backgroundColor: "#D9D9D9", color: "white" }}>
        <img src={logo} style={{ width: "15vw", height: "15vh" }} />
        <h1 style={{color: "black", paddingTop: "7vh"}}>¡Bienvenido de vuelta!</h1>
        <form style={{display: 'flex', flexDirection: 'column'}}>
            <div>
                <input style={{width: "50vw", height: "3.5vh", backgroundColor: "white", borderRadius:"1.5vh", borderWidth:0 ,color: "black"}} type="text" placeholder="Nombre Usuario" value={nickName} onChange={(e) => setNickName(e.target.value)}/>
            </div>
            <br />
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input style={{width: "50vw", height: "3.5vh", backgroundColor: "white", borderRadius:"1.5vh", borderWidth:0 ,color: "black"}} type={tipo} placeholder="Contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)}/>
                <span style={{ position: "absolute", right: "10px", top:"30%", cursor: "pointer" }} onClick={handleOcultarMostrar}>
                    {React.createElement(icono, { style: { width: "20px", height: "20px", color: "black" } })}
                </span>
            </div>
            <br />
            <button style={{backgroundColor: "#EA1F22", borderRadius:"1.5vh", borderWidth: 3, borderColor: "White"}} type="submit" onClick={handleIniciarSesion}>Iniciar Sesión</button>
        </form>
        <form style={{display: 'flex', flexDirection: 'column', paddingTop: "15vh"}}>
            <label style={{color: "black", fontSize: "2vh"}}>¿No tienes cuenta?</label>
            <button style={{color: "#EA1F22", backgroundColor: "white", borderRadius:"1.5vh", borderWidth: 3, borderColor: "#EA1F22"}} type="submit" onClick={handleCrearCuenta}>Crear Cuenta</button>
        </form>
    </div>
)
}

export default IniciarSesion;