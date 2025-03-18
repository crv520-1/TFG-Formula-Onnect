import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { getImagenCircuito } from './mapeoImagenes.js';

export const resultadoCircuito = () => {
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
            setCircuitos(circuito);
            const resultadosResponse = await axios.get(`https://api.jolpi.ca/ergast/f1/${year}/${round}/results.json`);
            const resultadosData = resultadosResponse.data.MRData.RaceTable.Races.Results;
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

            const horariosGranPremioResponse = await axios.get(`https://api.jolpi.ca/ergast/f1/${year}/${round}/races/.json`);
            const horariosGranPremioData = horariosGranPremioResponse.data.MRData.RaceTable.Races;
            horariosGranPremioData.forEach(horario => {
                horariosGranPremio.push({
                    diaCarrera: horario.date,
                    horaCarrera: horario.time,
                    diaClasificacion: horario.date,
                    horaClasificacion: horario.time,
                    diaFP3: horario.date,
                    horaFP3: horario.time,
                    diaFP2: horario.date,
                    horaFP2: horario.time,
                    diaFP1: horario.date,
                    horaFP1: horario.time
                });
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
      <img src={getImagenCircuito(circuitos.circuitId)} alt={circuitos.circuitName} />
    </div>
  )
}

export default resultadoCircuito