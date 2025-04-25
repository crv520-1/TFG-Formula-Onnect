import { BookOpenIcon, FlagIcon, HomeIcon, PlusCircleIcon, TrophyIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UsuarioContext } from "../context/UsuarioContext";

/**
 * Componente que muestra la barra lateral de navegación principal
 * Gestiona el estado visual de los botones según la ruta actual
 * Permite navegar entre las diferentes secciones de la aplicación
 */
export const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // Estado para mantener la ruta anterior (necesario para la vista de comentarios)
    const [prevPath, setPrevPath] = useState("");
    // Obtiene el ID del usuario actual del contexto
    const { user: idUsuario } = useContext(UsuarioContext);

    /**
     * Efecto que guarda la ruta anterior cuando el usuario navega
     * Excluye la ruta de comentarios para mantener la referencia a la vista original
     */
    useEffect(() => {
        if (location.pathname !== "/Comentarios" && location.pathname !== "/HiloComentarios") {
            setPrevPath(location.pathname);
        }
    }, [location.pathname]);

    /**
     * Función que determina el color de fondo de los botones según la ruta actual
     * Maneja casos especiales para la vista de comentarios
     * @param {string} path - Ruta a comparar
     * @returns {string} Código de color hexadecimal
     */
    const getBoton = (path) => {
        if (location.pathname === "/Comentarios" || location.pathname === "/HiloComentarios") {
            return prevPath === path ? "#FF1E00" : "#15151E";
        }
        return location.pathname === path ? "#FF1E00" : "#15151E";
    };

    // Funciones de navegación para cada sección principal de la aplicación
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
    <div style={{ paddingLeft: "1vh", height: "100vh", display: "flex", flexDirection: "column", width: "18vw" }} >
        <h2 className="titulo_app">Formula Onnect</h2>
        <br />
        <button type="submit" onClick={handleInicio} style={{ padding:"1vw", backgroundColor: getBoton("/Inicio"), borderRadius: "1.5vh", height: "5vh", width: "15vw", display: "flex", flexDirection: "row", alignItems: "center", color: "white", border: "none", outline: "none" }}>
            <HomeIcon className="icono_v3"/>
            <p className="datos_v11">Inicio</p>
        </button>
        <br />
        <button type="submit" onClick={handleGuia} style={{ padding:"1vw", backgroundColor: location.pathname === "/GuiaCircuitos" || location.pathname === "/GuiaPilotos" || location.pathname === "/GuiaEquipos" || location.pathname === "/DatosPiloto" || location.pathname === "/DatosEquipo" || location.pathname === "/DatosCircuito" ? "#FF1E00" : "#15151E", borderRadius: "1.5vh", height: "5vh", width: "15vw", display: "flex", flexDirection: "row", alignItems: "center", color: "white", border: "none", outline: "none" }}>
            <BookOpenIcon className="icono_v3"/>
            <p className="datos_v11">Guía</p>
        </button>
        <br />
        <button type="submit" onClick={handleCrear} style={{ padding:"1vw", backgroundColor: getBoton("/Crear"), borderRadius: "1.5vh", height: "5vh", width: "15vw", display: "flex", flexDirection: "row", alignItems: "center", color: "white", border: "none", outline: "none" }}>
            <PlusCircleIcon className="icono_v3"/>
            <p className="datos_v11">Crear</p>
        </button>
        <br />
        <button type="submit" onClick={handleClasificacion} style={{ padding:"1vw", backgroundColor: location.pathname === "/Clasificacion" || location.pathname === "/ClasificacionEquipos" ? "#FF1E00" : "#15151E", borderRadius: "1.5vh", height: "5vh", width: "15vw", display: "flex", flexDirection: "row", alignItems: "center", color: "white", border: "none", outline: "none" }}>
            <TrophyIcon className="icono_v3"/>
            <p className="datos_v11">Clasificación</p>
        </button>
        <br />
        <button type="submit" onClick={handleResultados} style={{ padding:"1vw", backgroundColor: location.pathname === "/Resultados" || location.pathname === "/ResultadoCircuito" ? "#FF1E00" : "#15151E", borderRadius: "1.5vh", height: "5vh", width: "15vw", display: "flex", flexDirection: "row", alignItems: "center", color: "white", border: "none", outline: "none" }}>
            <FlagIcon className="icono_v3"/>
            <p className="datos_v11">Resultados</p>
        </button>
        <br />
        <button type="submit" onClick={handlePerfil} style={{ padding:"1vw", backgroundColor: location.pathname === "/Perfil" || location.pathname === "/PerfilPublicaciones" || location.pathname === "/EditarPerfil" || (location.pathname === "/Comentarios" && (prevPath === "/PerfilPublicaciones")) || (location.pathname === "/HiloComentarios" && (prevPath === "/PerfilPublicaciones")) ? "#FF1E00" : "#15151E", borderRadius: "1.5vh", height: "5vh", width: "15vw", display: "flex", flexDirection: "row", alignItems: "center", color: "white", border: "none", outline: "none" }}>
            <UserCircleIcon className="icono_v3"/>
            <p className="datos_v11">Perfil</p>
        </button>
    </div>
  )
}

export default Dashboard;
