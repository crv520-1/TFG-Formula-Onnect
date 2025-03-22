import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { carga } from './animacionCargando.jsx';
import { getImagenPiloto } from './mapeoImagenes.js';

export const DatosPiloto = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pilotos, setPilotos] = useState([]);
  const [driverData, setDriverData] = useState(null);
  const { idPiloto } = location.state || {};
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pilotosResponse = await axios.get("http://localhost:3000/api/pilotos");
        const piloto = pilotosResponse.data.find(piloto => piloto.idPilotos === idPiloto);
        if (!piloto) {
          console.error("Piloto no encontrado");
          return;
        }
        setPilotos(piloto);

        // Consultar la wikipedia con la url del piloto para obtener los datos de interés
        const scraperResponse = await axios.get(`http://localhost:3000/api/scrapingPilotos/driver-data`, {
          params: { url: piloto.urlPiloto }
        });
        setDriverData(scraperResponse.data);
        setCargando(false);
      } catch (error) {
        console.error("Error en la API", error);
      }
      console.log("Pilotos:", pilotos);
    }
    fetchData();
  }, [idPiloto]);

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
    
  const handleCircuitos = (e) => {
    e.preventDefault();
    navigate("/GuiaCircuitos");
    console.log("Circuitos");
  }

  if (cargando) { 
    return carga(); 
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", marginTop: "2vh" }}>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} >
        <button type='submit' onClick={handlePilotos} style={{ fontSize: "2vh", height:"3vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border:"none", backgroundColor:"#C40000", width:"15vh" }}>Pilotos</button>
        <button type='submit' onClick={handleEquipos} style={{ fontSize: "2vh", height:"3vh", marginLeft: "20vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border:"none", backgroundColor:"#15151E" }}>Equipos</button>
        <button type='submit' onClick={handleCircuitos} style={{ fontSize: "2vh", height:"3vh", marginLeft: "20vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border:"none", backgroundColor:"#15151E" }}>Circuitos</button>
      </div>
      <br />
      <div style={{ display: "flex", flexDirection: "column", height:"auto", width:"100%", backgroundColor:"#2c2c2c", borderRadius:"1vh", padding:"2vh", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width:"50vw", height:"auto", borderRadius:"1vh", marginBottom: "2vh" }}>
          <p style={{ fontSize: "3vh", textAlign: "center", color: "white" }}>{pilotos.nombrePiloto}</p>
          <p style={{ fontSize: "3vh", textAlign: "center", color: "white", paddingLeft:"0.5vw" }}>{pilotos.apellidoPiloto}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRadius:"1vh", marginBottom: "2vh" }}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", borderRadius:"1vh", marginBottom: "2vh" }}>
            <img src={getImagenPiloto(pilotos.driverId)} alt="Imagen del piloto" style={{ width: "30vh", height: "30vh", objectFit:"contain"}} />
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRadius:"1vh", marginBottom: "2vh" }}>
              <img src={`https://flagcdn.com/w160/${pilotos.isoNacPil}.png`} alt={pilotos.isoNacPil} style={{ width: "6vh", height: "4vh" }} />
              <p style={{ fontSize: "2vh", textAlign: "center", color: "white", paddingLeft:"0.5vw" }}>{pilotos.nacionalidadPiloto}</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginBottom: "2vh", paddingLeft:"5vw" }}>
            {driverData && (
              <div style={{ color: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: "2vh" }}>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#3e3e3e", borderRadius: "1vh", margin: "1vh", width: "7vw", height: "10vh" }}>
                    <p style={{ textAlign: "center" }}>Fecha de nacimiento:</p>
                    <p style={{ textAlign: "center" }}>{driverData.birthDate}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#3e3e3e", borderRadius: "1vh", margin: "1vh", width: "7vw", height: "10vh" }}>
                    <p style={{ textAlign: "center" }}>Lugar de nacimiento:</p>
                    <p style={{ textAlign: "center" }}>{driverData.birthPlace}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#3e3e3e", borderRadius: "1vh", margin: "1vh", width: "7vw", height: "10vh" }}>
                    <p style={{ textAlign: "center" }}>Fecha de fallecimiento:</p>
                    <p style={{ textAlign: "center" }}>{driverData.deathDate}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#3e3e3e", borderRadius: "1vh", margin: "1vh", width: "7vw", height: "10vh" }}>
                    <p style={{ textAlign: "center" }}>Lugar de fallecimiento:</p>
                    <p style={{ textAlign: "center" }}>{driverData.deathPlace}</p>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: "2vh" }}>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#3e3e3e", borderRadius: "1vh", margin: "1vh", width: "7vw", height: "10vh" }}>
                    <p style={{ textAlign: "center" }}>Primera carrera:</p>
                    <p style={{ textAlign: "center" }}>{driverData.firstRace}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#3e3e3e", borderRadius: "1vh", margin: "1vh", width: "7vw", height: "10vh" }}>
                    <p style={{ textAlign: "center" }}>Primera Victoria:</p>
                    <p style={{ textAlign: "center" }}>{driverData.firstWin}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#3e3e3e", borderRadius: "1vh", margin: "1vh", width: "7vw", height: "10vh" }}>
                    <p style={{ textAlign: "center" }}>Última carrera:</p>
                    <p style={{ textAlign: "center" }}>{driverData.lastRace}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#3e3e3e", borderRadius: "1vh", margin: "1vh", width: "7vw", height: "10vh" }}>
                    <p style={{ textAlign: "center" }}>Carreras terminadas:</p>
                    <p style={{ textAlign: "center" }}>{driverData.racesFinished}</p>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: "2vh" }}>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#3e3e3e", borderRadius: "1vh", margin: "1vh", width: "7vw", height: "10vh" }}>
                    <p style={{ textAlign: "center" }}>Victorias:</p>
                    <p style={{ textAlign: "center" }}>{driverData.wins}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#3e3e3e", borderRadius: "1vh", margin: "1vh", width: "7vw", height: "10vh" }}>
                    <p style={{ textAlign: "center" }}>Poles:</p>
                    <p style={{ textAlign: "center" }}>{driverData.poles}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#3e3e3e", borderRadius: "1vh", margin: "1vh", width: "7vw", height: "10vh" }}>
                    <p style={{ textAlign: "center" }}>Vueltas rápidas:</p>
                    <p style={{ textAlign: "center" }}>{driverData.fastestLaps}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#3e3e3e", borderRadius: "1vh", margin: "1vh", width: "7vw", height: "10vh" }}>
                    <p style={{ textAlign: "center" }}>Podios:</p>
                    <p style={{ textAlign: "center" }}>{driverData.podiums}</p>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: "2vh" }}>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#3e3e3e", borderRadius: "1vh", margin: "1vh", width: "7vw", height: "10vh" }}>
                    <p style={{ textAlign: "center" }}>Mundiales:</p>
                    <p style={{ textAlign: "center" }}>{driverData.championships}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#3e3e3e", borderRadius: "1vh", margin: "1vh", width: "7vw", height: "10vh" }}>
                    <p style={{ textAlign: "center" }}>Puntos totales:</p>
                    <p style={{ textAlign: "center" }}>{driverData.points}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DatosPiloto;