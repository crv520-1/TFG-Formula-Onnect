import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import '../styles/Containers.css';
import { carga } from './animacionCargando.jsx';
import { getImagenCircuito, getImagenEquipo } from './mapeoImagenes.js';
import { getStatusTraducido } from './mapeoStatus.js';

/**
 * Componente que muestra los resultados de una carrera en un circuito específico
 * Obtiene datos de la API Ergast para mostrar horarios y resultados de carrera y sprint
 */
export const ResultadoCircuito = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Obtiene los parámetros del circuito desde el estado de navegación
  const { circuitId, year, round } = location.state || {};

  const [circuitos, setCircuitos] = useState([]);
  const [horariosGranPremio, setHorariosGranPremio] = useState([]);
  const [posiciones, setPosiciones] = useState([]);
  const [sprintPosiciones, setSprintPosiciones] = useState([]);
  const [disputada, setDisputada] = useState(true);
  const [sprintDisputada, setSprintDisputada] = useState(true);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    /**
     * Función que carga todos los datos necesarios para mostrar resultados
     * Realiza llamadas en paralelo para optimizar la carga
     */
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
        // Pequeño delay para mostrar la animación de carga
        setTimeout(() => setCargando(false), 500);
      }
    };

    loadData();
  }, [circuitId, year, round]);

  /**
   * Función para obtener los datos del circuito desde la base de datos
   * @param {string} circuitId - ID del circuito a consultar
   * @returns {Object} Datos del circuito
   */
  const fetchCircuito = async (circuitId) => {
    const response = await axios.get(`http://localhost:3000/api/circuitos`);
    const circuito = response.data.find(c => c.circuitId === circuitId);
    if (!circuito) {
      throw new Error("Circuito no encontrado");
    }
    return circuito;
  };
  
  /**
   * Función para obtener los resultados de la carrera desde la API Ergast
   * @param {number} year - Año de la temporada
   * @param {number} round - Número de carrera en la temporada
   * @returns {Array|null} Lista de resultados o null si no hay datos
   */
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
  
  /**
   * Función para obtener los horarios del Gran Premio desde la API Ergast
   * @param {number} year - Año de la temporada
   * @param {number} round - Número de carrera en la temporada
   * @returns {Object} Horarios formateados del Gran Premio
   */
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
  
  /**
   * Función para obtener los resultados de la carrera sprint desde la API Ergast
   * @param {number} year - Año de la temporada
   * @param {number} round - Número de carrera en la temporada
   * @returns {Array|null} Lista de resultados o null si no hay datos
   */
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

  /**
   * Función para navegar a la vista de calendario de resultados
   * @param {number} ano - Año del calendario a consultar
   */
  const handleCalendario = (ano) => {
    navigate("/Resultados", { state: { ano } });
  }

  /**
   * Función para mostrar diferente información según haya sprint o no
   * @param {Object} horario - Objeto con los horarios del Gran Premio
   * @returns {JSX.Element} Elemento con la información de los horarios
   */
  function mostrarCasoSprint(horario) {
    if (horario.hasSprint) {
      return (
        <div>
          <p className='datos_v10'>Clasificación Sprint: {horario.diaFP2}, {horario.horaFP2}</p>
          <p className='datos_v10'>Carrera Sprint: {horario.diaFP3}, {horario.horaFP3}</p>
        </div>
      );
    } else {
      return (
        <div>
          <p className='datos_v10'>FP2: {horario.diaFP2}, {horario.horaFP2}</p>
          <p className='datos_v10'>FP3: {horario.diaFP3}, {horario.horaFP3}</p>
        </div>
      )
    }
  }

  /**
   * Función que determina qué mostrar según el estado de las carreras
   * Muestra diferentes secciones dependiendo de si se han disputado carreras
   * @param {boolean} disputada - Indica si la carrera principal se ha disputado
   * @returns {JSX.Element} Elemento con los resultados o mensaje informativo
   */
  function mostrarDisputada(disputada) {
    if (horariosGranPremio.hasSprint === false) {
      if (!disputada) {
        return (
          <p className='datos_v11'>No se ha disputado aún la carrera</p>
        )
      } else {
        return (
          <div className='container_columna_2c'>
            <p className='datos_v11'>Resultados carrera</p>
            {frontendResultados(posiciones)}
          </div>
        )
      }
    } else {
      if (!sprintDisputada && !disputada) {
        return (
          <p className='datos_v11'>No se ha disputado aún el Gran Premio</p>
        )
      } else if (sprintDisputada && !disputada) {
        return (
          <div className='container_columna_2c'>
            <p className='datos_v11'>Resultados Sprint</p>
            {frontendResultados(sprintPosiciones)}
            <p className='datos_v12'>No se ha disputado aún la carrera</p>
          </div>
        )
      } else if (sprintDisputada && disputada) {
        return (
          <div className='container_columna_2c'>
            <p className='datos_v11'>Resultados Sprint</p>
            {frontendResultados(sprintPosiciones)}
            <p className='datos_v11'>Resultados carrera</p>
            {frontendResultados(posiciones)}
          </div>
        )
      }
    }
  }

  /**
   * Función para renderizar los resultados de carrera en el formato adecuado
   * @param {Array} posiciones - Lista de resultados a mostrar
   * @returns {JSX.Element} Elemento con la tabla de resultados
   */
  function frontendResultados(posiciones) {
    return (
      <div className='container_grid'>
        {posiciones.map((posicion, index) => {
          const isEven = index % 2 !== 0;
          return (
            <div key={index} style={{ display: "flex", flexDirection: "row", alignItems: "center", backgroundColor: "#1a1a1a", padding: "5px 10px", borderRadius: "0.5vh", marginBottom: "1vh", paddingLeft: "0.5vh", transform: isEven ? "translateY(1.5vh)" : "none" }}>
              <div className='container_minWidth_v2'>
                <span className='span_v3_bold_v2'>{posicion.position}</span>
              </div>
              <span className='span_v5'>{posicion.driver}</span>
              <img src={getImagenEquipo(posicion.constructorId)} alt={posicion.constructorId} className='imagen_equipo_v2'/>
              <span className='span_v6'>{posicion.status}</span>
              <span className='span_v7'>{`+${posicion.puntos}`}</span>
            </div>
          );
        })}
      </div>
    )
  }

  // Muestra animación de carga mientras se obtienen los datos
  if (cargando) { return ( carga() ); }

  return (
    <div className='container_overflow'>
      <div className='container_fila_paddingBottomTop'>
        <button type='submit' onClick={() => handleCalendario(year)} className='boton_fondo_c4_v2'>Calendario</button>
      </div>
      <div className='container_overflow_padding'>
      <div className='container_columna_2c_v2'>
        <p className='datos_v7'>{circuitos.nombreCircuito}</p>
        <div className='container_fila_2c_margin'>
          <img src={getImagenCircuito(circuitos.circuitId)} alt={circuitos.circuitId} className='imagen_circuito_v3'/>
          <div className='container_columna_2c_margin'>
            <div className='container_fila_2c_margin'>
              <img src={`https://flagcdn.com/w160/${circuitos.isoPais}.png`} alt={circuitos.isoPais} className='imagen_bandera'/>
              <p className='datos_v6'>{circuitos.ciudad}, {circuitos.pais}</p>
            </div>
            {horariosGranPremio && (
              <div>
                <p className='datos_v10'>FP1: {horariosGranPremio.diaFP1}, {horariosGranPremio.horaFP1}</p>
                {mostrarCasoSprint(horariosGranPremio)}
                <p className='datos_v10'>Clasificación: {horariosGranPremio.diaClasificacion}, {horariosGranPremio.horaClasificacion}</p>
                <p className='datos_v10'>Carrera: {horariosGranPremio.diaCarrera}, {horariosGranPremio.horaCarrera}</p>
              </div>
            )}
          </div>  
        </div>
        {mostrarDisputada(disputada)}
      </div>
      </div>
      <br/>
    </div>
  )
}

export default ResultadoCircuito