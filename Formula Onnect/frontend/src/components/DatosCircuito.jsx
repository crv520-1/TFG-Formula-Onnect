import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { carga } from './animacionCargando';
import { getImagenCircuito } from './mapeoImagenes.js';

export const DatosCircuito = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [circuito, setCircuito] = useState({});
  const { idCircuito } = location.state || {};
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const circuitoResponse = await axios.get(`http://localhost:3000/api/circuitos`);
        const circuito = circuitoResponse.data.find(circuito => circuito.idCircuitos === idCircuito);
        if (!circuito) {
          console.error("Circuito no encontrado");
          return
        }
        setCircuito(circuito);
        setCargando(false);
      } catch (error) {
        console.error("Error en la API", error);
      }
    };
    fetchData();
  }, [idCircuito]);

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

  function getLongitudCarrera(vueltas, longitudCircuito) {
    // Redondeamos a 3 decimales el resultado
    return (vueltas * longitudCircuito).toFixed(3);
  }

  if (cargando) { 
    return carga();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", maxHeight: "98vh", overflow: "auto" }}>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} >
        <button type='submit' onClick={handleF1} style={{ fontSize: "2vh", height:"3vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border:"none", backgroundColor:"#15151E" }}>F1</button>
        <button type='submit' onClick={handlePilotos} style={{ fontSize: "2vh", height:"3vh", marginLeft: "20vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border:"none", backgroundColor:"#15151E" }}>Pilotos</button>
        <button type='submit' onClick={handleEquipos} style={{ fontSize: "2vh", height:"3vh", marginLeft: "20vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border:"none", backgroundColor:"#15151E" }}>Equipos</button>
        <button type='submit' onClick={handleCircuitos} style={{ fontSize: "2vh", height:"3vh", marginLeft: "20vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border:"none", backgroundColor:"#C40000", width:"15vh" }}>Circuitos</button>
      </div>
      <br />
      <div style={{ display: "flex", flexDirection: "column", height:"100%", overflow:"auto", backgroundColor:"#2c2c2c", borderRadius:"1vh", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", height:"auto", borderRadius:"1vh", marginBottom: "2vh" }}>
          <p style={{ fontSize: "3vh", textAlign: "center", color: "white", paddingLeft:"1vw" }}>{circuito.nombreCircuito}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", borderRadius:"1vh", marginBottom: "1vh" }}>
        <img src={getImagenCircuito(circuito.circuitId)} alt="Foto del equipo" style={{ width: "65vh", height: "35vh" }} />
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRadius:"1vh", marginBottom: "1vh" }}>
            <img src={`https://flagcdn.com/w160/${circuito.isoPais}.png`} alt={circuito.isoPais} style={{ width: "6vh", height: "4vh" }} />
            <p style={{ fontSize: "2vh", textAlign: "center", color: "white", paddingLeft:"0.5vw" }}>{circuito.ciudad}</p>
            <p style={{ fontSize: "2vh", textAlign: "center", color: "white", paddingLeft:"0.5vw" }}>,</p>
            <p style={{ fontSize: "2vh", textAlign: "center", color: "white", paddingLeft:"0.5vw" }}>{circuito.pais}</p>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginBottom: "2vh" }}>
          <div style={{ color: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: "2vh" }}>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#3e3e3e", borderRadius: "1vh", margin: "1vh", width: "10vw", height: "12vh" }}>
                <p style={{ textAlign: "center" }}>Primera carrera:</p>
                <p style={{ textAlign: "center" }}>{circuito.primeraCarrera}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#3e3e3e", borderRadius: "1vh", margin: "1vh", width: "10vw", height: "12vh" }}>
                <p style={{ textAlign: "center" }}>Última carrera:</p>
                <p style={{ textAlign: "center" }}>{circuito.ultimaCarrera}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#3e3e3e", borderRadius: "1vh", margin: "1vh", width: "10vw", height: "12vh" }}>
                <p style={{ textAlign: "center" }}>Record de pista:</p>
                <p style={{ textAlign: "center" }}>{circuito.recordPista}</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: "2vh" }}>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#3e3e3e", borderRadius: "1vh", margin: "1vh", width: "10vw", height: "12vh" }}>
                <p style={{ textAlign: "center" }}>Longitud del circuito:</p>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                  <p style={{ textAlign: "center" }}>{circuito.longitudCircuito}</p>
                  <p style={{ textAlign: "center" }}>km</p>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#3e3e3e", borderRadius: "1vh", margin: "1vh", width: "10vw", height: "12vh" }}>
                <p style={{ textAlign: "center" }}>Número de vueltas:</p>
                <p style={{ textAlign: "center" }}>{circuito.vueltas}</p>
              </div>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#3e3e3e", borderRadius: "1vh", margin: "1vh", width: "10vw", height: "12vh" }}>
                  <p style={{ textAlign: "center" }}>Longitud de carrera:</p>
                  <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <p style={{ textAlign: "center" }}>{getLongitudCarrera(circuito.vueltas, circuito.longitudCircuito)}</p>
                    <p style={{ textAlign: "center" }}>km</p>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default DatosCircuito;