import axios from "axios";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImagenPiloto } from './mapeoImagenes.js';

export const GuiaPilotos = () => {
  const navigate = useNavigate();
  const [pilotos, setPilotos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pilotosResponse = await axios.get("http://localhost:3000/api/pilotos");
        setPilotos(pilotosResponse.data);
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

  const handleEquipos = (e) => {
    e.preventDefault();
    navigate("/GuiaEquipos");
    console.log("Equipos");
  }
    
  const handleCircuitos = (e) => {
    e.preventDefault();
    navigate("/GuiaCircuitos");
    console.log("Circuitos");
  }

  const handlePiloto = (idPiloto) => {
    // Navegar a la vista de un piloto
    console.log("Piloto", idPiloto);
    navigate(`/DatosPiloto`, { state: { idPiloto } });
  }
        
  return (
    <div style={{ display: "flex", flexDirection: "column", maxHeight: "98vh", overflow: "auto" }}>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} >
        <button type='submit' onClick={handleF1} style={{ fontSize: "2vh", height:"3vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border:"none", backgroundColor:"#15151E" }}>F1</button>
        <h2 style={{ backgroundColor: "#C40000", borderRadius:"0.5vh", width: "15vh", marginLeft: "20vh", fontSize:"2vh", textAlign: "center", cursor:"pointer" }}>Pilotos</h2>
        <button type='submit' onClick={handleEquipos} style={{ fontSize: "2vh", height:"3vh", marginLeft: "20vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border:"none", backgroundColor:"#15151E" }}>Equipos</button>
        <button type='submit' onClick={handleCircuitos} style={{ fontSize: "2vh", height:"3vh", marginLeft: "20vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border:"none", backgroundColor:"#15151E" }}>Circuitos</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", maxHeight: "100%", overflow: "auto" }}>
        {pilotos.reduce((rows, piloto, index) => {
          if (index % 4 === 0) rows.push([]);
          rows[rows.length - 1].push(piloto);
          return rows;
        }, []).map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            {row.map((piloto) => (
              <button key={piloto.idPilotos} onClick={() => handlePiloto(piloto.idPilotos)} style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", margin: "1vh", backgroundColor:"#2c2c2c", borderRadius:"1vh", width: "23vh", height: "23vh", border:"none" }}>
                <img src={getImagenPiloto(piloto.driverId)} alt="Foto de piloto" style={{ width: "15vh", height: "15vh" }} />
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", paddingRight:"2vw", textAlign: "left" }}>
                    <p style={{ fontSize: "2vh", margin: "0vh", marginTop:"0vh" }}>{piloto.nombrePiloto}</p>
                    <p style={{ fontSize: "2vh", margin: "0vh" }}>{piloto.apellidoPiloto}</p>
                  </div>
                  <img src={`https://flagcdn.com/w160/${piloto.isoNacPil}.png`} alt={piloto.isoNacPil} style={{ width: "6vh", height: "4vh" }} />
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default GuiaPilotos;