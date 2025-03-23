import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { getImagenCircuito } from './mapeoImagenes.js';

export const Resultados = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { ano } = location.state || {};
  const [circuitos, setCircuitos] = useState([]);
  const [year, setYear] = useState(ano || 2025);
  let circuitosDatos = [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const circuitosAnoResponse = await axios.get(`https://api.jolpi.ca/ergast/f1/${year}/races/`)
        const circuitosAno = circuitosAnoResponse.data.MRData.RaceTable.Races;
        circuitosAno.forEach(circuitoAno => {
            const fechaInicioFinDeSemana = circuitoAno.FirstPractice 
            ? new Date(circuitoAno.FirstPractice.date).toLocaleDateString('es-ES')
            : new Date(circuitoAno.date).toLocaleDateString('es-ES');
            circuitosDatos.push({
              circuitId: circuitoAno.Circuit.circuitId,
              fechaCarrera: new Date(circuitoAno.date).toLocaleDateString('es-ES'),
              fechaInicioFinDeSemana: fechaInicioFinDeSemana,
              ronda: circuitoAno.round
            });
        });
        
        const circuitosResponse = await axios.get(`http://localhost:3000/api/circuitos`);
        // Comprobar si el circuito obtenido está en la temporada actual
        const uniqueCircuitos = {};
        circuitosResponse.data.forEach(circuito => {
          circuitosDatos.forEach(circuitoAno => {
            if (circuito.circuitId === circuitoAno.circuitId) {
              uniqueCircuitos[circuito.circuitId] = {
                ...circuito,
                fechaCarrera: circuitoAno.fechaCarrera,
                fechaInicioFinDeSemana: circuitoAno.fechaInicioFinDeSemana,
                ronda: circuitoAno.ronda
              };
            }
          });
        });
        // Ordenamos los circuitos por ronda, para tener el calendario en orden
        const sortedCircuitos = Object.values(uniqueCircuitos).sort((a, b) => a.ronda - b.ronda);
        setCircuitos(Object.values(sortedCircuitos));
      } catch (error) {
        console.error("Error en la API", error);
      }
    };
    fetchData();
  }, [year]);

  const handleCircuito = (circuitId, year, round) => {
    // Navegar a la vista de los resultados de un circuito
    console.log("Datos", circuitId, year, round);
    navigate(`/ResultadoCircuito`, { state: { circuitId, year, round } });
  }

  // Se crea un array que comprenda los años entre el 2000 y el 2025
  const years = Array.from({ length: 26 }, (_, i) => 2025 - i);
  
  return (
    <div style={{ display: "flex", flexDirection: "column", maxHeight: "98vh", overflow: "auto" }}>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} >
        <h2 style={{ backgroundColor: "#C40000", borderRadius:"0.5vh", width: "15vh", fontSize:"2vh", textAlign: "center" }}>Calendario</h2>
      </div>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        {/* Seleccionable para elegir el año */}
        <select style={{ borderRadius: "2vh", margin: "1vh", padding: "1vh", border:"none", backgroundColor:"#2C2C2C", color:"white" }} onChange={(e) => setYear(e.target.value)} value={year}>
          {years.map(year => ( <option key={year} value={year}>{year}</option> ))}
        </select>
      </div>
      <div style={{ display: "flex", flexDirection: "column", maxHeight: "100%", overflow: "auto", padding:"2vh" }}>
        {circuitos.map((circuito) => (
          <button key={circuito.idCircuitos} onClick={() => handleCircuito(circuito.circuitId, year, circuito.ronda)} style={{ borderRadius: "2vh", margin: "1vh", padding: "1vh", border:"none", backgroundColor:"#2C2C2C" }}>
            <div key={circuito.idCircuitos} style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
              <img src={getImagenCircuito(circuito.circuitId)} alt={circuito.circuitId} style={{ width: "45vh", height: "25vh" }} />
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", paddingLeft: "5vw" }}>
                <h3 style={{ fontSize: "2.5vh", textAlign: "center" }}>{circuito.nombreCircuito}</h3>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                  <img src={`https://flagcdn.com/w160/${circuito.isoPais}.png`} alt={circuito.isoPais} style={{ width: "6vh", height: "4vh" }} />
                  <p style={{ fontSize: "1.5vh", textAlign: "center", paddingLeft:"0.5vw" }}>{circuito.ciudad}, {circuito.pais}</p>
                </div>
                <p style={{ fontSize: "1.5vh", textAlign: "center", paddingLeft:"0.5vw" }}>{circuito.fechaInicioFinDeSemana} - {circuito.fechaCarrera}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Resultados;