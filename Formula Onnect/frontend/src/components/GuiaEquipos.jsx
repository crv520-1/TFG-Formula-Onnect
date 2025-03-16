import axios from "axios";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImagenEquipo, getLivery } from './mapeoImagenes.js';

export const GuiaEquipos = () => {
    const navigate = useNavigate();
    const [equipos, setEquipos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const equiposResponse = await axios.get("http://localhost:3000/api/equipos");
                setEquipos(equiposResponse.data);
            } catch (error) {
                console.error("Error en la API", error);
            }
        }
        fetchData();
    }, []);

    const handleF1 = (e) => {
        e.preventDefault();
        navigate("/Guia");
        console.log("F1");
    }

    const handlePilotos = (e) => {
        e.preventDefault();
        navigate("/GuiaPilotos");
        console.log("Pilotos");
    }
    
    const handleCircuitos = (e) => {
        e.preventDefault();
        navigate("/GuiaCircuitos");
        console.log("Circuitos");
    }

    const handleEquipo = (idEquipo) => {
        // Navegar a la vista de un equipo
        console.log("Equipo", idEquipo);
        navigate(`/DatosEquipo`, { state: { idEquipo } });
    }

  return (
    <div style={{ display: "flex", flexDirection: "column", maxHeight: "98vh", overflow: "auto" }}>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} >
            <button type='submit' onClick={handleF1} style={{ fontSize: "2vh", height:"3vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border:"none", backgroundColor:"#15151E" }}>F1</button>
            <button type='submit' onClick={handlePilotos} style={{ fontSize: "2vh", height:"3vh", marginLeft: "20vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border:"none", backgroundColor:"#15151E" }}>Pilotos</button>
            <h2 style={{ backgroundColor: "#C40000", borderRadius:"0.5vh", width: "15vh", marginLeft: "20vh", fontSize:"2vh", textAlign: "center", cursor:"pointer" }}>Equipos</h2>
            <button type='submit' onClick={handleCircuitos} style={{ fontSize: "2vh", height:"3vh", marginLeft: "20vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border:"none", backgroundColor:"#15151E" }}>Circuitos</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxHeight: "100%", overflow: "auto" }}>
            {equipos.reduce((rows, equipo, index) => {
                if (index % 4 === 0) rows.push([]);
                rows[rows.length - 1].push(equipo);
                return rows;
            }, []).map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    {row.map((equipo) => (
                        <button key={equipo.idEquipos} onClick={() => handleEquipo(equipo.idEquipos)} style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", margin: "1vh", backgroundColor:"#2c2c2c", borderRadius:"1vh", width: "25vh", height: "25vh", border:"none" }}>
                            <img src={getLivery(equipo.constructorId)} alt="Foto del equipo" style={{ width: "25vh", height: "25vh", borderRadius:"1vh" }} />
                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", paddingTop:"0.5vh" }}>
                                <p style={{ fontSize: "2vh", margin: "0vh", marginTop:"0vh" }}>{equipo.nombreEquipo}</p>
                                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                    <img src={`https://flagcdn.com/w160/${equipo.isoNacEqui}.png`} alt={equipo.isoNacEqui} style={{ width: "5vh", height: "3vh", paddingLeft:"2vw" }} />
                                    <img src={getImagenEquipo(equipo.constructorId)} alt="Foto del equipo" style={{ width: "5vh", height: "3vh", paddingLeft:"2vw", paddingTop:"0.25vh" }} />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            ))}
        </div>
    </div>
  )
}

export default GuiaEquipos;