import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { getImagenCircuito } from './mapeoImagenes.js';

export const ResultadoCircuito = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { circuitId, year, round } = location.state || {};
  const [circuitos, setCircuitos] = useState([]);
  let horariosGranPremio = [];
  let posiciones = [];

  useEffect(() => {
    const fetchData = async () => {
        try {
          const circuitosResponse = await axios.get(`http://localhost:3000/api/circuitos`);
          const circuito = circuitosResponse.data.find(circuito => circuito.circuitId === circuitId);
          if (!circuito) {
            console.error("Circuito no encontrado");
            return;
          }
          setCircuitos(circuito);

          const resultadosResponse = await axios.get(`https://api.jolpi.ca/ergast/f1/${year}/${round}/results.json`);
          const resultadosData = resultadosResponse.data.MRData.RaceTable.Races[0].Results;
          resultadosData.forEach(resultado => {
            posiciones.push({
              position: resultado.position,
              driver: resultado.Driver.givenName + " " + resultado.Driver.familyName, //Esto o cambiar por driverId para luego consultar en mi bd por el driverId para obtener los datos de nombre y apellidos del piloto
              team: resultado.Constructor.name,
              constructorId: resultado.Constructor.constructorId,
              puntos: resultado.points,
              status: resultado.status
            });
          });

          const horariosGranPremioResponse = await axios.get(`https://api.jolpi.ca/ergast/f1/${year}/${round}/races.json`);
          const horariosGranPremioData = horariosGranPremioResponse.data.MRData.RaceTable.Races[0];
          horariosGranPremio.push({
            diaCarrera: horariosGranPremioData.date ? horariosGranPremioData.date : "N/A fecha",
            horaCarrera: horariosGranPremioData.time ? horariosGranPremioData.time : "N/A hora",
            diaClasificacion: horariosGranPremioData.Qualifying.date ? horariosGranPremioData.Qualifying.date : "N/A fecha",
            horaClasificacion: horariosGranPremioData.Qualifying.time ? horariosGranPremioData.Qualifying.time : "N/A hora",
            diaFP3: horariosGranPremioData.ThirdPractice ? horariosGranPremioData.ThirdPractice.date : horariosGranPremioData.SprintQualifying ? horariosGranPremioData.Sprint.date : "N/A fecha",
            horaFP3: horariosGranPremioData.ThirdPractice ? horariosGranPremioData.ThirdPractice.time : horariosGranPremioData.SprintQualifying ? horariosGranPremioData.Sprint.time : "N/A hora",
            diaFP2: horariosGranPremioData.SecondPractice ? horariosGranPremioData.SecondPractice.date : horariosGranPremioData.SprintQualifying ? horariosGranPremioData.SprintQualifying.date : "N/A fecha",
            horaFP2: horariosGranPremioData.SecondPractice ? horariosGranPremioData.SecondPractice.time : horariosGranPremioData.SprintQualifying ? horariosGranPremioData.SprintQualifying.time : "N/A hora",
            diaFP1: horariosGranPremioData.FirstPractice ? horariosGranPremioData.FirstPractice.date : "N/A fecha",
            horaFP1: horariosGranPremioData.FirstPractice ? horariosGranPremioData.FirstPractice.time : "N/A hora",
          });
        } 
        catch (error) {
            console.error("Error en la API", error);
        }
    }
    fetchData();
  }, [circuitId]);

  return (
    <div style={{ display: "flex", flexDirection: "column", maxHeight: "98vh", overflow: "auto" }}>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} >
        <h2 style={{ backgroundColor: "#C40000", borderRadius:"0.5vh", width: "15vh", fontSize:"2vh", textAlign: "center" }}>Calendario</h2>
      </div>
      <img src={getImagenCircuito(circuitos.circuitId)} alt={circuitos.circuitId} />
    </div>
  )
}

export default ResultadoCircuito