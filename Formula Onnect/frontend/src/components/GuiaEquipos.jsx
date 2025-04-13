import axios from "axios";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Containers.css";
import { carga } from './animacionCargando';
import { getImagenEquipo, getLivery } from './mapeoImagenes.js';

export const GuiaEquipos = () => {
    const navigate = useNavigate();
    const [equipos, setEquipos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            setCargando(true);
            try {
                const equipos = await cargarEquipos();
                if (!equipos) {
                    console.error("No se encontraron equipos");
                    return;
                }
                setEquipos(equipos);
            } catch (error) {
                console.error("Error en la API", error);
            }
            setTimeout(() => { setCargando(false); }, 500);
        }
        cargarDatos();
    }, []);

    const cargarEquipos = async () => {
        try {
            const equiposResponse = await axios.get("http://localhost:3000/api/equipos");
            const data = equiposResponse.data;
            if (!data) {
                console.error("No se encontraron equipos");
                return;
            }
            return data;
        } catch (error) {
            console.error("Error en la API", error);
        }
    }

    const handlePilotos = (e) => {
        e.preventDefault();
        navigate("/GuiaPilotos");
    }
    
    const handleCircuitos = (e) => {
        e.preventDefault();
        navigate("/GuiaCircuitos");
    }

    const handleEquipo = (idEquipo) => {
        // Navegar a la vista de un equipo
        navigate(`/DatosEquipo`, { state: { idEquipo } });
    }

    if (cargando) { return carga(); }

  return (
    <div className="container_overflow">
        <div className="container_fila">
            <button type='submit' onClick={handlePilotos} className="boton_fondo_15_v3">Pilotos</button>
            <h2 className="titulo_c4_v3">Equipos</h2>
            <button type='submit' onClick={handleCircuitos} className="boton_fondo_15_v4">Circuitos</button>
        </div>
        <div className="container_overflow_padding">
            {equipos.reduce((rows, equipo, index) => {
                if (index % 4 === 0) rows.push([]);
                rows[rows.length - 1].push(equipo);
                return rows;
            }, []).map((row, rowIndex) => (
                <div key={rowIndex} className="container_fila">
                    {row.map((equipo) => (
                        <button key={equipo.idEquipos} onClick={() => handleEquipo(equipo.idEquipos)} className="boton_fondo_2c_v8">
                            <img src={getLivery(equipo.constructorId)} alt="Foto del equipo" className="imagen_livery_v3"/>
                            <div className="container_fila_paddingTop">
                                <p className="datos_v8">{equipo.nombreEquipo}</p>
                                <div className="container_columna">
                                    <img src={`https://flagcdn.com/w160/${equipo.isoNacEqui}.png`} alt={equipo.isoNacEqui} className="imagen_equipo_v4"/>
                                    <img src={getImagenEquipo(equipo.constructorId)} alt="Foto del equipo" className="imagen_bandera_v3"/>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            ))}
        </div>
        <br/>
    </div>
  )
}

export default GuiaEquipos;