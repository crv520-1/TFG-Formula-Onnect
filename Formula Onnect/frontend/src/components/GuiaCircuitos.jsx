import axios from "axios";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImagenCircuito } from './mapeoImagenes.js';

export const GuiaCircuitos = () => {
    const navigate = useNavigate();
    const [circuitos, setCircuitos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const circuitosResponse = await axios.get("http://localhost:3000/api/circuitos");
                setCircuitos(circuitosResponse.data);
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

    const handleEquipos = (e) => {
        e.preventDefault();
        navigate("/GuiaEquipos");
        console.log("Equipos");
    }

    const handleCircuito = (idCircuito) => {
        // Navegar a la vista de un circuito
        console.log("Circuito", idCircuito);
        navigate(`/DatosCircuito`, { state: { idCircuito } });
    }

  return (
    <div style={{ display: "flex", flexDirection: "column", maxHeight: "98vh", overflow: "auto" }}>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} >
        <button type='submit' onClick={handleF1} style={{ fontSize: "2vh", height:"3vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border:"none", backgroundColor:"#15151E" }}>F1</button>
        <button type='submit' onClick={handlePilotos} style={{ fontSize: "2vh", height:"3vh", marginLeft: "20vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border:"none", backgroundColor:"#15151E" }}>Pilotos</button>
        <button type='submit' onClick={handleEquipos} style={{ fontSize: "2vh", height:"3vh", marginLeft: "20vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border:"none", backgroundColor:"#15151E" }}>Equipos</button>
        <h2 style={{ backgroundColor: "#C40000", borderRadius:"0.5vh", width: "15vh", marginLeft: "20vh", fontSize:"2vh", textAlign: "center", cursor:"pointer" }}>Circuitos</h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", maxHeight: "100%", overflow: "auto" }}>
        {circuitos.reduce((rows, circuito, index) => {
          if (index % 3 === 0) rows.push([]);
          rows[rows.length - 1].push(circuito);
          return rows;
        }, []).map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            {row.map((circuito) => (
              <button key={circuito.idCircuitos} onClick={() => handleCircuito(circuito.idCircuitos)} style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", margin: "1vh", backgroundColor:"#2c2c2c", borderRadius:"1vh", width: "35vh", height: "30vh", border:"none" }}>
                <p style={{ fontSize: "2vh", margin: "0vh", marginTop:"0vh" }}>{circuito.nombreCircuito}</p>
                <img src={getImagenCircuito(circuito.circuitId)} alt="Foto del circuito" style={{ width: "30vh", height: "25vh", paddingTop:"0.5vh" }} />
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", paddingTop:"0.5vh" }}>
                    <img src={`https://flagcdn.com/w160/${circuito.isoPais}.png`} alt={circuito.isoPais} style={{ width: "5vh", height: "3vh" }} />
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