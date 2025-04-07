import axios from "axios";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Containers.css";
import { carga } from './animacionCargando';
import { getImagenPiloto } from './mapeoImagenes.js';

export const GuiaPilotos = () => {
  const navigate = useNavigate();
  const [pilotos, setPilotos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      try {
        const pilotos = await cargarPilotos();
        if (!pilotos) {
          console.error("No se encontraron pilotos");
          return;
        }
        setPilotos(pilotos);
      } catch (error) {
        console.error("Error en la API", error);
      }
      setTimeout(() => { setCargando(false); }, 500);
    }
    cargarDatos();
  }, []);

  const cargarPilotos = async () => {
    setCargando(true);
    try {
      const pilotosResponse = await axios.get("http://localhost:3000/api/pilotos");
      const data = pilotosResponse.data;
      if (!data) {
        console.error("No se encontraron pilotos");
        return;
      }
      return data;
    } catch (error) {
      console.error("Error en la API", error);
    }
  }

  const handleEquipos = (e) => {
    e.preventDefault();
    navigate("/GuiaEquipos");
  }
    
  const handleCircuitos = (e) => {
    e.preventDefault();
    navigate("/GuiaCircuitos");
  }

  const handlePiloto = (idPiloto) => {
    // Navegar a la vista de un piloto
    navigate(`/DatosPiloto`, { state: { idPiloto } });
  }

  if (cargando) { return carga(); }
        
  return (
    <div className="container_overflow">
      <div className="container_fila">
        <h2 style={{ backgroundColor: "#C40000", borderRadius:"0.5vh", width: "15vh", fontSize:"2vh", textAlign: "center", cursor:"pointer" }}>Pilotos</h2>
        <button type='submit' onClick={handleEquipos} style={{ fontSize: "2vh", height:"3vh", marginLeft: "20vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border:"none", backgroundColor:"#15151E" }}>Equipos</button>
        <button type='submit' onClick={handleCircuitos} style={{ fontSize: "2vh", height:"3vh", marginLeft: "20vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border:"none", backgroundColor:"#15151E" }}>Circuitos</button>
      </div>
      <div className="container_overflow_padding">
        {pilotos.reduce((rows, piloto, index) => {
          if (index % 4 === 0) rows.push([]);
          rows[rows.length - 1].push(piloto);
          return rows;
        }, []).map((row, rowIndex) => (
          <div key={rowIndex} className="container_fila">
            {row.map((piloto) => (
              <button key={piloto.idPilotos} onClick={() => handlePiloto(piloto.idPilotos)} style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", margin: "1vh", backgroundColor:"#2c2c2c", borderRadius:"1vh", width: "23vh", height: "23vh", border:"none" }}>
                <img src={getImagenPiloto(piloto.driverId)} alt="Foto de piloto" style={{ width: "15vh", height: "15vh", objectFit:"contain" }} />
                <div className="container_fila">
                  <div className="container_columna_izquierda">
                    <p style={{ fontSize: "2vh", margin: "0vh", marginTop:"0vh" }}>{piloto.nombrePiloto}</p>
                    <p style={{ fontSize: "2vh", margin: "0vh" }}>{piloto.apellidoPiloto}</p>
                  </div>
                  <img src={`https://flagcdn.com/w160/${piloto.isoNacPil}.png`} alt={piloto.isoNacPil} style={{ width: "6vh", height: "4vh", objectFit:"contain" }} />
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