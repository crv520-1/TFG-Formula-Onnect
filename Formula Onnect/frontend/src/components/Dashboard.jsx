import { BookOpenIcon, FlagIcon, HomeIcon, PlusCircleIcon, TrophyIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";

export const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [prevPath, setPrevPath] = useState("");
    const { user: idUsuario } = useContext(UsuarioContext);

    useEffect(() => {
        if (location.pathname !== "/Comentarios") {
            setPrevPath(location.pathname);
        }
    }, [location.pathname]);

    const getBoton = (path) => {
        if (location.pathname === "/Comentarios") {
            return prevPath === path ? "#C40000" : "#15151E";
        }
        return location.pathname === path ? "#C40000" : "#15151E";
    };

    const handleInicio = (e) => {
        e.preventDefault();
        navigate("/Inicio");
    }

    const handleGuia = (e) => {
        e.preventDefault();
        navigate("/GuiaPilotos");
    }

    const handleCrear = (e) => {
        e.preventDefault();
        navigate("/Crear");
    }

    const handleClasificacion = (e) => {
        e.preventDefault();
        navigate("/Clasificacion");
    }

    const handleResultados = (e) => {
        e.preventDefault();
        navigate("/Resultados");
    }

    const handlePerfil = (e) => {
        e.preventDefault();
        navigate("/Perfil", { state: { idUser: idUsuario } });
    }

  return (
    <div style={{ paddingLeft: "1vh", height: "100vh", display: "flex", flexDirection: "column", width: "12vw" }} >
        <h2 style={{ fontSize: "3vh" }}>Formula Onnect</h2>
        <br />
        <button type="submit" onClick={handleInicio} style={{ padding:"1vw", backgroundColor: getBoton("/Inicio"), borderRadius: "1.5vh", height: "3vh", width: "11vw", display: "flex", flexDirection: "row", alignItems: "center", color: "white", border: "none" }}>
            <HomeIcon style={{ color: "white", width:"3vw", height:"3vh" }} />
            <p style={{ color: "white", fontSize:"2vh" }}>Inicio</p>
        </button>
        <br />
        <button type="submit" onClick={handleGuia} style={{ padding:"1vw", backgroundColor: location.pathname === "/GuiaCircuitos" || location.pathname === "/GuiaPilotos" || location.pathname === "/GuiaEquipos" || location.pathname === "/DatosPiloto" || location.pathname === "/DatosEquipo" || location.pathname === "/DatosCircuito" ? "#C40000" : "#15151E", borderRadius: "1.5vh", height: "3vh", width: "11vw", display: "flex", flexDirection: "row", alignItems: "center", color: "white", border: "none" }}>
            <BookOpenIcon style={{ color: "white", width:"3vw", height:"3vh" }} />
            <p style={{ color: "white", fontSize:"2vh" }}>Guía</p>
        </button>
        <br />
        <button type="submit" onClick={handleCrear} style={{ padding:"1vw", backgroundColor: getBoton("/Crear"), borderRadius: "1.5vh", height: "3vh", width: "11vw", display: "flex", flexDirection: "row", alignItems: "center", color: "white", border: "none" }}>
            <PlusCircleIcon style={{ color: "white", width:"3vw", height:"3vh" }} />
            <p style={{ color: "white", fontSize:"2vh" }}>Crear</p>
        </button>
        <br />
        <button type="submit" onClick={handleClasificacion} style={{ padding:"1vw", backgroundColor: location.pathname === "/Clasificacion" || location.pathname === "/ClasificacionEquipos" ? "#C40000" : "#15151E", borderRadius: "1.5vh", height: "3vh", width: "11vw", display: "flex", flexDirection: "row", alignItems: "center", color: "white", border: "none" }}>
            <TrophyIcon style={{ color: "white", width:"3vw", height:"3vh" }} />
            <p style={{ color: "white", fontSize:"2vh" }}>Clasificación</p>
        </button>
        <br />
        <button type="submit" onClick={handleResultados} style={{ padding:"1vw", backgroundColor: location.pathname === "/Resultados" || location.pathname === "/ResultadoCircuito" ? "#C40000" : "#15151E", borderRadius: "1.5vh", height: "3vh", width: "11vw", display: "flex", flexDirection: "row", alignItems: "center", color: "white", border: "none" }}>
            <FlagIcon style={{ color: "white", width:"3vw", height:"3vh" }} />
            <p style={{ color: "white", fontSize:"2vh" }}>Resultados</p>
        </button>
        <br />
        <button type="submit" onClick={handlePerfil} style={{ padding:"1vw", backgroundColor: location.pathname === "/Perfil" || location.pathname === "/PerfilPublicaciones" || location.pathname === "/EditarPerfil" || (location.pathname === "/Comentarios" && (prevPath === "/PerfilPublicaciones")) ? "#C40000" : "#15151E", borderRadius: "1.5vh", height: "3vh", width: "11vw", display: "flex", flexDirection: "row", alignItems: "center", color: "white", border: "none" }}>
           <UserCircleIcon style={{ color: "white", width:"3vw", height:"3vh" }} />
            <p style={{ color: "white", fontSize:"2vh" }}>Perfil</p>
        </button>
    </div>
  )
}

export default Dashboard;
