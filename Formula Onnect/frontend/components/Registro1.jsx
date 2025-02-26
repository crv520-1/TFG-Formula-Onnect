import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Registro1 = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [nickName, setNickName] = useState("");
    const [nombreCompleto, setNombreCompleto] = useState("");
    const [email, setEmail] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [contraseñaRepe, setContraseñaRepe] = useState("");
    const navigate = useNavigate();
    let logo = "images/logo/logoApp.png";

    useEffect(() => {
        axios.get("http://localhost:3000/api/usuarios").then(response => {
            setUsuarios(response.data);
        }).catch(error => {
            console.error("Error al obtener los usuarios:", error);
        });
    }, []);

    const handleContinuarRegistro = (e) => {
        e.preventDefault();
        if (!nickName || !nombreCompleto || !email || !contraseña || !contraseñaRepe) {
            alert("Por favor, llene todos los campos");
            return;
        } else {
            console.log("Campos llenos");   
            if (contraseña !== contraseñaRepe) {
                alert("Las contraseñas no coinciden");
                return;
            } else {
                console.log("Contraseñas coinciden");
                if (nickName === usuarios.nickName) {
                    alert("El nombre de usuario ya existe");
                    return;
                } else if (email === usuarios.email) {
                    alert("El email ya está registrado");
                    return;
                } else {
                    console.log("Registro continuado");
                    navigate("/RegistroNext", {state: { nickName, nombreCompleto, email, contraseña }});
                }
            }
        }
    };

    const handleIniciarSesion = (e) => {
        e.preventDefault();
        // Add your login logic here
        console.log("Iniciar sesión");
    };

    return (
        <div style={{display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", height: "95vh", width: "100vw", paddingTop: "50px", backgroundColor: "#D9D9D9", color: "white" }}>
            <img src={logo} style={{ width: "15vw", height: "15vh" }} />
            <h1 style={{color: "black", paddingTop: "7vh"}}>¡Bienvenido!</h1>
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
                <div>
                    <input style={{width: "50vw", height: "3.5vh", backgroundColor: "white", borderRadius:"1.5vh", borderWidth:0 ,color: "black"}} type="text" placeholder="Contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)}/>
                </div>
                <br />
                <div>
                    <input style={{width: "50vw", height: "3.5vh", backgroundColor: "white", borderRadius:"1.5vh", borderWidth:0 ,color: "black"}} type="text" placeholder="Repetir Contraseña" value={contraseñaRepe} onChange={(e) => setContraseñaRepe(e.target.value)}/>
                </div>
                <br />
                <button style={{backgroundColor: "#EA1F22", borderRadius:"1.5vh", borderWidth: 3, borderColor: "White"}} type="submit" onClick={handleContinuarRegistro}>Continuar</button>
            </form>
            <form style={{display: 'flex', flexDirection: 'column', paddingTop: "15vh"}}>
                <label style={{color: "black", fontSize: "2vh"}}>¿Ya tienes cuenta?</label>
                <button style={{color: "#EA1F22", backgroundColor: "white", borderRadius:"1.5vh", borderWidth: 3, borderColor: "#EA1F22"}} type="submit" onClick={handleIniciarSesion}>Iniciar Sesión</button>
            </form>
        </div>
    );
};

export default Registro1;