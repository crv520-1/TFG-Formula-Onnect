import axios from "axios";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Containers.css";
import { carga } from "./animacionCargando.jsx";
import { getImagenCircuito } from './mapeoImagenes.js';

export const GuiaCircuitos = () => {
    const navigate = useNavigate();
    const [circuitos, setCircuitos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
          setCargando(true);
            try {
                const circuitos = await cargarCircuitos();
                if (!circuitos) {
                    console.error("No se encontraron circuitos");
                    return;
                }
                setCircuitos(circuitos);
            } catch (error) {
                console.error("Error en la API", error);
            }
            setTimeout(() => { setCargando(false); }, 500);
        }
        cargarDatos();
    }, []);

    const cargarCircuitos = async () => {
      try {
        const circuitosResponse = await axios.get("http://localhost:3000/api/circuitos");
        const data = circuitosResponse.data;
        if (!data) {
          console.error("No se encontraron circuitos");
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

    const handleEquipos = (e) => {
        e.preventDefault();
        navigate("/GuiaEquipos");
    }

    const handleCircuito = (idCircuito) => {
        // Navegar a la vista de un circuito
        navigate(`/DatosCircuito`, { state: { idCircuito } });
    }

    if (cargando) { return carga(); }

  return (
    <div className="container_overflow">
      <div className="container_fila">
        <button type='submit' onClick={handlePilotos} style={{ fontSize: "2vh", height:"3vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border:"none", backgroundColor:"#15151E" }}>Pilotos</button>
        <button type='submit' onClick={handleEquipos} style={{ fontSize: "2vh", height:"3vh", marginLeft: "20vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border:"none", backgroundColor:"#15151E" }}>Equipos</button>
        <h2 style={{ backgroundColor: "#C40000", borderRadius:"0.5vh", width: "15vh", marginLeft: "20vh", fontSize:"2vh", textAlign: "center", cursor:"pointer" }}>Circuitos</h2>
      </div>
      <div className="container_overflow_padding">
        {circuitos.reduce((rows, circuito, index) => {
          if (index % 3 === 0) rows.push([]);
          rows[rows.length - 1].push(circuito);
          return rows;
        }, []).map((row, rowIndex) => (
          <div key={rowIndex} className="container_fila">
            {row.map((circuito) => (
              <button key={circuito.idCircuitos} onClick={() => handleCircuito(circuito.idCircuitos)} style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", margin: "1vh", backgroundColor:"#2c2c2c", borderRadius:"1vh", width: "35vh", height: "30vh", border:"none" }}>
                <p style={{ fontSize: "2vh", margin: "0vh", marginTop:"0vh" }}>{circuito.nombreCircuito}</p>
                <img src={getImagenCircuito(circuito.circuitId)} alt="Foto del circuito" style={{ width: "30vh", height: "25vh", paddingTop:"0.5vh", objectFit:"contain" }} />
                <div className="container_fila_paddingTop">
                    <img src={`https://flagcdn.com/w160/${circuito.isoPais}.png`} alt={circuito.isoPais} style={{ width: "5vh", height: "3vh", objectFit:"contain" }} />
                    <p style={{ fontSize: "2vh", margin: "0vh", marginTop:"0vh", paddingLeft:"0.5vw" }}>{circuito.ciudad}</p>
                    <p style={{ fontSize: "2vh", margin: "0vh" }}>,</p>
                    <p style={{ fontSize: "2vh", margin: "0vh", paddingLeft:"0.25vw" }}>{circuito.pais}</p>
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default GuiaCircuitos;