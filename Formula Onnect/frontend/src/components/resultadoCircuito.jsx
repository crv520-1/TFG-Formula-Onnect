import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { carga } from './animacionCargando.jsx';
import { getImagenCircuito, getImagenEquipo } from './mapeoImagenes.js';

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

  const temporizadorRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
        try {
          setCargando(true); // Ensure loading starts
          const circuitosResponse = await axios.get(`http://localhost:3000/api/circuitos`);
          const circuito = circuitosResponse.data.find(circuito => circuito.circuitId === circuitId);
          if (!circuito) {
            console.error("Circuito no encontrado");
            setCargando(false);
            return;
          }
          setCircuitos(circuito);

          const resultadosResponse = await axios.get(`https://api.jolpi.ca/ergast/f1/${year}/${round}/results.json`);
          const resultadosData = resultadosResponse.data.MRData.RaceTable.Races[0];
          if (!resultadosData) {
            setDisputada(false);
            console.error("No hay resultados");
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

          if (hasSprint === true) {
            const sprintResultadosResponse = await axios.get(`https://api.jolpi.ca/ergast/f1/${year}/${round}/sprint.json`);
            const sprintResultadosData = sprintResultadosResponse.data.MRData.RaceTable.Races[0];
            if (!sprintResultadosData) {
              setSprintDisputada(false);
              console.error("No hay resultados Sprint");
            } else {
              console.log("Resultados Sprint", sprintResultadosData);
              if (Array.isArray(sprintResultadosData.SprintResults)) {
                const nuevasPosicionesSprint = sprintResultadosData.SprintResults.map(resultado => ({
                  position: resultado.position,
                  driver: resultado.Driver.givenName + " " + resultado.Driver.familyName,
                  constructorId: resultado.Constructor.constructorId,
                  puntos: resultado.points,
                  status: resultado.status
                }));
                setSprintPosiciones(nuevasPosicionesSprint);
                console.log("Posiciones Sprint", sprintPosiciones);
              } else {
                console.error("Resultados Sprint no es un array");
              }
            }
          } else {
            console.error("No hay Sprint");
            setSprintDisputada(false);
          }
        } 
        catch (error) {
            console.error("Error en la API", error);
        } finally {
            temporizadorRef.current = setTimeout(() => {
              setCargando(false);
            }, 1000);
        }
    };

    fetchData();

    return () => {
      if (temporizadorRef.current) {
        clearTimeout(temporizadorRef.current);
      }
    };
  }, [circuitId, year, round]);

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
    if (horariosGranPremio.hasSprint === false) {
      if (!disputada) {
        return (
          <p style={{ fontSize: "2vh", color: "white", textAlign: "center" }}>No se ha disputado aún la carrera</p>
        )
      } else {
        return (
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#2C2C2C", borderRadius: "0.5vh" }}>
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
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#2C2C2C", borderRadius: "0.5vh" }}>
            <p style={{ fontSize: "2vh", color: "white", textAlign: "center" }}>Resultados Sprint</p>
            {frontendResultados(sprintPosiciones)}
            <p style={{ fontSize: "2vh", color: "white", textAlign: "center", paddingTop:"3vh" }}>No se ha disputado aún la carrera</p>
          </div>
        )
      } else if (sprintDisputada && disputada) {
        return (
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#2C2C2C", borderRadius: "0.5vh" }}>
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
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", width: "100%" }}>
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

  if (cargando) {
    return ( carga() );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", maxHeight: "98vh", overflow: "auto" }}>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", paddingBottom: "2vh", paddingTop:"2vh" }} >
        <button type='submit' onClick={() => handleCalendario(year)} style={{ fontSize: "2vh", height:"3vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border:"none", backgroundColor:"#C40000", width:"15vh" }}>Calendario</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", maxHeight: "100%", overflow: "auto", paddingRight:"2vh" }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#2C2C2C", borderRadius: "0.5vh", width: "100%", paddingBottom: "2vh" }}>
        <p style={{ fontSize: "2vh", color: "white" }}>{circuitos.nombreCircuito}</p>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: "#2C2C2C", borderRadius: "0.5vh", margin: "2vh" }}>
          <img src={getImagenCircuito(circuitos.circuitId)} alt={circuitos.circuitId} style={{ width: "50vh", height: "35vh", objectFit:"contain" }}/>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#2C2C2C", borderRadius: "0.5vh", margin: "2vh" }}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: "#2C2C2C", borderRadius: "0.5vh", margin: "2vh" }}>
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