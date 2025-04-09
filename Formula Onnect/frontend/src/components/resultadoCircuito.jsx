import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import '../styles/Containers.css';
import { carga } from './animacionCargando.jsx';
import { getImagenCircuito, getImagenEquipo } from './mapeoImagenes.js';
import { getStatusTraducido } from './mapeoStatus.js';

export const ResultadoCircuito = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { circuitId, year, round } = location.state || {};
  const [circuitos, setCircuitos] = useState([]);
  const [horariosGranPremio, setHorariosGranPremio] = useState([]);
  const [posiciones, setPosiciones] = useState([]);
  const [sprintPosiciones, setSprintPosiciones] = useState([]);
  const [disputada, setDisputada] = useState(true);
  const [sprintDisputada, setSprintDisputada] = useState(true);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setCargando(true);

        const [circuito, resultados, horarios] = await Promise.all([
          fetchCircuito(circuitId),
          fetchCarreraResultados(year, round),
          fetchHorarios(year, round)
        ]);

        setCircuitos(circuito);
        setHorariosGranPremio(horarios);
        setDisputada(!!resultados);
        if (resultados) setPosiciones(resultados);

        if (horarios.hasSprint) {
          const sprintResults = await fetchSprintResultados(year, round);
          setSprintDisputada(!!sprintResults);
          if (sprintResults) setSprintPosiciones(sprintResults);
        } else {
          setSprintDisputada(false);
        }

      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setTimeout(() => setCargando(false), 500);
      }
    };

    loadData();
  }, [circuitId, year, round]);

  const fetchCircuito = async (circuitId) => {
    const response = await axios.get(`http://localhost:3000/api/circuitos`);
    const circuito = response.data.find(c => c.circuitId === circuitId);
    if (!circuito) {
      throw new Error("Circuito no encontrado");
    }
    return circuito;
  };
  
  const fetchCarreraResultados = async (year, round) => {
    const response = await axios.get(`https://api.jolpi.ca/ergast/f1/${year}/${round}/results.json`);
    const resultadosData = response.data.MRData.RaceTable.Races[0];
    if (!resultadosData?.Results) return null;
  
    return resultadosData.Results.map(resultado => ({
      position: resultado.position,
      driver: `${resultado.Driver.givenName} ${resultado.Driver.familyName}`,
      team: resultado.Constructor.name,
      constructorId: resultado.Constructor.constructorId,
      puntos: resultado.points,
      status: getStatusTraducido(resultado.status)
    }));
  };
  
  const fetchHorarios = async (year, round) => {
    const response = await axios.get(`https://api.jolpi.ca/ergast/f1/${year}/${round}/races.json`);
    const data = response.data.MRData.RaceTable.Races[0];
    
    const formatFecha = (fecha) => fecha ? new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : "N/A fecha";
    const formatHora = (hora) => hora ? new Date(`2023-01-01T${hora}`).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : "N/A hora";
    
    return {
      diaCarrera: formatFecha(data.date),
      horaCarrera: formatHora(data.time),
      diaClasificacion: formatFecha(data.Qualifying?.date),
      horaClasificacion: formatHora(data.Qualifying?.time),
      diaFP3: formatFecha(data.ThirdPractice?.date || data.Sprint?.date),
      horaFP3: formatHora(data.ThirdPractice?.time || data.Sprint?.time),
      diaFP2: formatFecha(data.SecondPractice?.date || data.SprintQualifying?.date),
      horaFP2: formatHora(data.SecondPractice?.time || data.SprintQualifying?.time),
      diaFP1: formatFecha(data.FirstPractice?.date),
      horaFP1: formatHora(data.FirstPractice?.time),
      hasSprint: !!data.Sprint
    };
  };
  
  const fetchSprintResultados = async (year, round) => {
    const response = await axios.get(`https://api.jolpi.ca/ergast/f1/${year}/${round}/sprint.json`);
    const data = response.data.MRData.RaceTable.Races[0];
    if (!data?.SprintResults) return null;
  
    return data.SprintResults.map(resultado => ({
      position: resultado.position,
      driver: `${resultado.Driver.givenName} ${resultado.Driver.familyName}`,
      constructorId: resultado.Constructor.constructorId,
      puntos: resultado.points,
      status: getStatusTraducido(resultado.status)
    }));
  };

  const handleCalendario = (ano) => {
    navigate("/Resultados", { state: { ano } });
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
    if (horariosGranPremio.hasSprint === false) {
      if (!disputada) {
        return (
          <p style={{ fontSize: "2vh", color: "white", textAlign: "center" }}>No se ha disputado aún la carrera</p>
        )
      } else {
        return (
          <div className='container_columna_2c'>
            <p style={{ fontSize: "2vh", color: "white", textAlign: "center" }}>Resultados carrera</p>
            {frontendResultados(posiciones)}
          </div>
        )
      }
    } else {
      if (!sprintDisputada && !disputada) {
        return (
          <p style={{ fontSize: "2vh", color: "white", textAlign: "center" }}>No se ha disputado aún el Gran Premio</p>
        )
      } else if (sprintDisputada && !disputada) {
        return (
          <div className='container_columna_2c'>
            <p style={{ fontSize: "2vh", color: "white", textAlign: "center" }}>Resultados Sprint</p>
            {frontendResultados(sprintPosiciones)}
            <p style={{ fontSize: "2vh", color: "white", textAlign: "center", paddingTop:"3vh" }}>No se ha disputado aún la carrera</p>
          </div>
        )
      } else if (sprintDisputada && disputada) {
        return (
          <div className='container_columna_2c'>
            <p style={{ fontSize: "2vh", color: "white", textAlign: "center" }}>Resultados Sprint</p>
            {frontendResultados(sprintPosiciones)}
            <p style={{ fontSize: "2vh", color: "white", textAlign: "center" }}>Resultados carrera</p>
            {frontendResultados(posiciones)}
          </div>
        )
      }
    }
  }

  function frontendResultados(posiciones) {
    return (
      <div className='container_grid'>
        {posiciones.map((posicion, index) => {
          const isEven = index % 2 !== 0;
          return (
            <div key={index} style={{ display: "flex", flexDirection: "row", alignItems: "center", backgroundColor: "#1a1a1a", padding: "5px 10px", borderRadius: "0.5vh", marginBottom: "1vh", paddingLeft: "0.5vh", transform: isEven ? "translateY(1.5vh)" : "none" }}>
              <div style={{ minWidth: "25px", textAlign: "center", backgroundColor: "#C40000", borderRadius: "50%", padding: "2px" }}>
                <span style={{ fontSize: "1.5vh", color: "white", fontWeight: "bold" }}>{posicion.position}</span>
              </div>
              <span style={{ fontSize: "1.5vh", color: "white", margin: "0 10px" }}>{posicion.driver}</span>
              <img src={getImagenEquipo(posicion.constructorId)} alt={posicion.constructorId} style={{ width: "5vh", height: "5vh", objectFit:"contain" }}/>
              <span style={{ fontSize: "1.4vh", color: "#aaa", marginLeft: "10px" }}>{posicion.status}</span>
              <span style={{ fontSize: "1.4vh", color: "#ffcc00", marginLeft: "10px" }}>{`+${posicion.puntos}`}</span>
            </div>
          );
        })}
      </div>
    )
  }

  if (cargando) { return ( carga() ); }

  return (
    <div className='container_overflow'>
      <div className='container_fila_paddingBottomTop'>
        <button type='submit' onClick={() => handleCalendario(year)} className='boton_fondo_c4_v2'>Calendario</button>
      </div>
      <div className='container_overflow_padding'>
      <div className='container_columna_2c_v2'>
        <p style={{ fontSize: "2vh", color: "white" }}>{circuitos.nombreCircuito}</p>
        <div className='container_fila_2c_margin'>
          <img src={getImagenCircuito(circuitos.circuitId)} alt={circuitos.circuitId} style={{ width: "50vh", height: "35vh", objectFit:"contain" }}/>
          <div className='container_columna_2c_margin'>
            <div className='container_fila_2c_margin'>
              <img src={`https://flagcdn.com/w160/${circuitos.isoPais}.png`} alt={circuitos.isoPais} style={{ width: "6vh", height: "4vh", objectFit:"contain" }} />
              <p style={{ fontSize: "1.5vh", color: "white", textAlign: "center", paddingLeft:"0.5vw" }}>{circuitos.ciudad}, {circuitos.pais}</p>
            </div>
            {horariosGranPremio && (
              <div>
                <p style={{ fontSize: "1.5vh", color: "white", textAlign: "center" }}>FP1: {horariosGranPremio.diaFP1}, {horariosGranPremio.horaFP1}</p>
                {mostrarCasoSprint(horariosGranPremio)}
                <p style={{ fontSize: "1.5vh", color: "white", textAlign: "center" }}>Clasificación: {horariosGranPremio.diaClasificacion}, {horariosGranPremio.horaClasificacion}</p>
                <p style={{ fontSize: "1.5vh", color: "white", textAlign: "center" }}>Carrera: {horariosGranPremio.diaCarrera}, {horariosGranPremio.horaCarrera}</p>
              </div>
            )}
          </div>  
        </div>
        {mostrarDisputada(disputada)}
      </div>
      </div>
    </div>
  )
}

export default ResultadoCircuito