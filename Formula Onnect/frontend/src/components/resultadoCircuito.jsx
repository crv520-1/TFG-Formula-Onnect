import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { getImagenCircuito } from './mapeoImagenes.js';

export const ResultadoCircuito = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { circuitId, year, round } = location.state || {};
  const [circuitos, setCircuitos] = useState([]);
  const [horariosGranPremio, setHorariosGranPremio] = useState([]);
  const [posiciones, setPosiciones] = useState([]);
  const [disputada, setDisputada] = useState(true);

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
          const resultadosData = resultadosResponse.data.MRData.RaceTable.Races[0];
          if (!resultadosData) {
            setDisputada(false);
            console.error("No hay resultados");
            return;
          } else {
            console.log("Resultados", resultadosData);
            if (Array.isArray(resultadosData.Results)) {
              const nuevasPosiciones = resultadosData.Results.map(resultado => ({
                position: resultado.position,
                driver: resultado.Driver.givenName + " " + resultado.Driver.familyName, //Esto o cambiar por driverId para luego consultar en mi bd por el driverId para obtener los datos de nombre y apellidos del piloto
                team: resultado.Constructor.name,
                constructorId: resultado.Constructor.constructorId,
                puntos: resultado.points,
                status: resultado.status
              }));
              setPosiciones(nuevasPosiciones);
              console.log("Posiciones", posiciones);
            } else {
              console.error("Resultados no es un array");
            }
          }

          const horariosGranPremioResponse = await axios.get(`https://api.jolpi.ca/ergast/f1/${year}/${round}/races.json`);
          const horariosGranPremioData = horariosGranPremioResponse.data.MRData.RaceTable.Races[0];
          console.log("Horarios", horariosGranPremioData);
          const hasSprint = !!horariosGranPremioData.Sprint; //Comprueba que exista la propiedad Sprint y en caso afirmativo lo pone en true mediante el doble signo de exclamación
          const formatFecha = (fecha) => fecha ? new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : "N/A fecha";
          const formatHora = (hora) => hora ? new Date(`2023-01-01T${hora}`).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : "N/A hora";
          const nuevosHorarios = ({
            diaCarrera: formatFecha(horariosGranPremioData.date),
            horaCarrera: formatHora(horariosGranPremioData.time),
            diaClasificacion: formatFecha(horariosGranPremioData.Qualifying?.date),
            horaClasificacion: formatHora(horariosGranPremioData.Qualifying?.time),
            diaFP3: formatFecha(horariosGranPremioData.ThirdPractice?.date || (horariosGranPremioData.Sprint?.date)),
            horaFP3: formatHora(horariosGranPremioData.ThirdPractice?.time || (horariosGranPremioData.Sprint?.time)),
            diaFP2: formatFecha(horariosGranPremioData.SecondPractice?.date || (horariosGranPremioData.SprintQualifying?.date)),
            horaFP2: formatHora(horariosGranPremioData.SecondPractice?.time || (horariosGranPremioData.SprintQualifying?.time)),
            diaFP1: formatFecha(horariosGranPremioData.FirstPractice?.date),
            horaFP1: formatHora(horariosGranPremioData.FirstPractice?.time),
            hasSprint: hasSprint
          });
          setHorariosGranPremio(nuevosHorarios);
          console.log("Horarios", horariosGranPremio);
        } 
        catch (error) {
            console.error("Error en la API", error);
        }
    }
    fetchData();
  }, [circuitId]);

  const handleCalendario = (ano) => {
    console.log(ano);
    navigate("/Resultados", { state: { ano } });
    console.log("Calendario");
  }

  function mostrarCasoSprint(horario) {
    if (horario.hasSprint) {
      return (
        <div>
          <p style={{ fontSize: "1.5vh", color: "white", textAlign: "center" }}>Clasificación Sprint: {horario.diaFP2}, {horario.horaFP2}</p>
          <p style={{ fontSize: "1.5vh", color: "white", textAlign: "center" }}>Carrera Sprint: {horario.diaFP3}, {horario.horaFP3}</p>
        </div>
      );
    } else {
      return (
        <div>
          <p style={{ fontSize: "1.5vh", color: "white", textAlign: "center" }}>FP2: {horario.diaFP2}, {horario.horaFP2}</p>
          <p style={{ fontSize: "1.5vh", color: "white", textAlign: "center" }}>FP3: {horario.diaFP3}, {horario.horaFP3}</p>
        </div>
      )
    }
  }

  function mostrarDisputada(disputada) {
    if (disputada === false) {
      return (
        <p style={{ fontSize: "2vh", color: "white", textAlign: "center" }}>No se ha disputado aún la carrera</p>
      )
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", maxHeight: "98vh", overflow: "auto" }}>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} >
        <button type='submit' onClick={() => handleCalendario(year)} style={{ fontSize: "2vh", height:"3vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border:"none", backgroundColor:"#C40000" }}>Calendario</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#2C2C2C", borderRadius: "0.5vh", width: "auto", margin: "2vh" }}>
        <p style={{ fontSize: "2vh", color: "white" }}>{circuitos.nombreCircuito}</p>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: "#2C2C2C", borderRadius: "0.5vh", margin: "2vh" }}>
          <img src={getImagenCircuito(circuitos.circuitId)} alt={circuitos.circuitId} style={{ width: "45vh", height: "25vh", objectFit:"contain" }}/>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#2C2C2C", borderRadius: "0.5vh", margin: "2vh" }}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: "#2C2C2C", borderRadius: "0.5vh", margin: "2vh" }}>
              <img src={`https://flagcdn.com/w160/${circuitos.isoPais}.png`} alt={circuitos.isoPais} style={{ width: "6vh", height: "4vh", objectFit:"contain" }} />
              <p style={{ fontSize: "1.5vh", color: "white", textAlign: "center", paddingLeft:"0.5vw" }}>{circuitos.ciudad}, {circuitos.pais}</p>
            </div>
            {horariosGranPremio && (
              <div>
                <p style={{ fontSize: "1.5vh", color: "white", textAlign: "center" }}>FP1: {horariosGranPremio.diaFP1}, {horariosGranPremio.horaFP1}</p>
                {mostrarCasoSprint(horariosGranPremio)}
                <p style={{ fontSize: "1.5vh", color: "white", textAlign: "center" }}>Carrera: {horariosGranPremio.diaCarrera}, {horariosGranPremio.horaCarrera}</p>
              </div>
            )}
          </div>  
        </div>
      </div>
      {mostrarDisputada(disputada)}
    </div>
  )
}

export default ResultadoCircuito