import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { getImagenPiloto } from './mapeoImagenes.js';

export const DatosPiloto = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pilotos, setPilotos] = useState([]);
  const [driverData, setDriverData] = useState(null);
  const { idPiloto } = location.state || {};

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
      } catch (error) {
        console.error("Error en la API", error);
      }
      console.log("Pilotos:", pilotos);
    }
    fetchData();
  }, [idPiloto]);

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
    
  const handleCircuitos = (e) => {
    e.preventDefault();
    navigate("/GuiaCircuitos");
    console.log("Circuitos");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", marginTop: "2vh" }}>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} >
        <button type='submit' onClick={handleF1} style={{ fontSize: "2vh", height:"3vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border:"none", backgroundColor:"#15151E" }}>F1</button>
        <button type='submit' onClick={handlePilotos} style={{ fontSize: "2vh", height:"3vh", marginLeft: "20vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border:"none", backgroundColor:"#C40000", width:"15vh" }}>Pilotos</button>
        <button type='submit' onClick={handleEquipos} style={{ fontSize: "2vh", height:"3vh", marginLeft: "20vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border:"none", backgroundColor:"#15151E" }}>Equipos</button>
        <button type='submit' onClick={handleCircuitos} style={{ fontSize: "2vh", height:"3vh", marginLeft: "20vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border:"none", backgroundColor:"#15151E" }}>Circuitos</button>
      </div>
      <br />
      <div style={{ display: "flex", flexDirection: "column", height:"auto", width:"100%", backgroundColor:"#2c2c2c", borderRadius:"1vh", padding:"2vh" }}>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width:"50vw", height:"auto", borderRadius:"1vh", marginBottom: "2vh" }}>
          <p style={{ fontSize: "2vh", textAlign: "center", color: "white" }}>{pilotos.nombrePiloto}</p>
          <p style={{ fontSize: "2vh", textAlign: "center", color: "white", paddingLeft:"0.5vw" }}>{pilotos.apellidoPiloto}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRadius:"1vh", marginBottom: "2vh" }}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", borderRadius:"1vh", marginBottom: "2vh" }}>
            <img src={getImagenPiloto(pilotos.driverId)} alt="Imagen del piloto" style={{ width: "30vh", height: "30vh"}} />
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRadius:"1vh", marginBottom: "2vh" }}>
              <img src={`https://flagcdn.com/w160/${pilotos.isoNacPil}.png`} alt={pilotos.isoNacPil} style={{ width: "6vh", height: "4vh" }} />
              <p style={{ fontSize: "2vh", textAlign: "center", color: "white" }}>{pilotos.nacionalidadPiloto}</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginBottom: "2vh", paddingLeft:"20vw" }}>
            {driverData && (
              <div style={{ color: "white" }}>
                <p>Fecha de nacimiento: {driverData.birthDate}</p>
                <p>Lugar de nacimiento: {driverData.birthPlace}</p>
                <p>Fecha de fallecimiento: {driverData.deathDate}</p>
                <p>Lugar de fallecimiento: {driverData.deathPlace}</p>
                <p>Año de debut: {driverData.debutYear}</p>
                <p>Mundiales ganados: {driverData.championships}</p>
                <p>Victorias: {driverData.wins}</p>
                <p>Poles: {driverData.poles}</p>
                <p>Vueltas rápidas: {driverData.fastestLaps}</p>
                <p>Podios: {driverData.podiums}</p>
                <p>Puntos totales: {driverData.points}</p>
                <p>Grandes Premios terminados: {driverData.racesFinished}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DatosPiloto;