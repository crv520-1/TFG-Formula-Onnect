import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { getPaisISO } from '../../../backend/scripts/mapeoPaises';
import { getImagenEquipo, getLivery } from './mapeoImagenes';

export const ClasificacionEquipos = () => {
  const navigate = useNavigate();
  const [year, setYear] = useState(2025);
  const [clasificacion, setClasificacion] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clasificacionResponse = await axios.get(`https://api.jolpi.ca/ergast/f1/${year}/constructorstandings.json`);
        const clasificacionData = clasificacionResponse.data.MRData.StandingsTable.StandingsLists[0];
        const standings = clasificacionData.ConstructorStandings.map(equipo => ({
          position: equipo.position,
          points: equipo.points,
          constructorId: equipo.Constructor.constructorId,
          nombre: equipo.Constructor.name,
          nacionalidad: getPaisISO(equipo.Constructor.nationality)
        }));
        setClasificacion(standings);
        console.log(standings);
      } catch (error) {
        console.error("Error en la API", error);
      }
    };
    fetchData();
  }, [year]);

  const handlePilotos = (e) => {
    e.preventDefault();
    navigate("/Clasificacion");
    console.log("Pilotos");
  }

  // Se crea un array que comprenda los años entre el 2000 y el 2025
  const years = Array.from({ length: 26 }, (_, i) => 2025 - i);

  const getColorPosicion = (posicion) => {
    if (posicion === 1) return "#FFD700";
    if (posicion === 2) return "#C0C0C0";
    if (posicion === 3) return "#CD7F32";
    return "white";
  }

  const getEstiloPosicion = (posicion) => {
    if (posicion === 1) return "bold";
    if (posicion === 2) return "bold";
    if (posicion === 3) return "bold";
    return "normal";
  }
    
  return (
    <div style={{ display: "flex", flexDirection: "column", maxHeight: "98vh", overflow: "auto" }}>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} >
        <button type='submit' onClick={handlePilotos} style={{ fontSize: "2vh", height:"3vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor:"#15151E", border: "none" }}>Pilotos</button>
        <h2 style={{ backgroundColor: "#C40000", borderRadius:"0.5vh", width: "15vh", fontSize:"2vh", textAlign: "center", marginLeft: "35vh" }}>Equipos</h2>
      </div> 
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        {/* Seleccionable para elegir el año */}
        <select style={{ borderRadius: "2vh", margin: "1vh", padding: "1vh", border:"none", backgroundColor:"#2C2C2C", color:"white", fontSize:"1.25vh" }} onChange={(e) => setYear(e.target.value)} value={year}>
          {years.map(year => ( <option key={year} value={year}>{year}</option> ))}
        </select>
      </div>
      <div style={{ display: "flex", flexDirection: "column", maxHeight: "100%", overflow: "auto", padding:"2vh" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2vh" }}>
          {clasificacion.map((equipo, index) => (
            <div key={equipo.constructorId} style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", backgroundColor:"#2c2c2c", borderRadius:"1vh", gap: "1vh", width:"22vw", justifyContent: "space-between",  ...(clasificacion.length % 2 !== 0 && index === clasificacion.length - 1 ? { gridColumn: "1 / span 2", justifySelf: "center" } : {}) }}>
              <div style={{ display: "flex", flexDirection: "column", paddingLeft: "0.5vw" }}>
                <div style={{ display: "flex", flexDirection: "row", paddingLeft: "1vw" }}>
                  <span style={{ fontSize: "2.5vh", color: getColorPosicion(Number(equipo.position)), textAlign: "center", paddingBottom:"1vh", fontWeight:getEstiloPosicion(Number(equipo.position)) }}>{equipo.position ? equipo.position : "-"}. </span>
                  <span style={{ fontSize: "2vh", color: "white", textAlign: "center", paddingLeft:"0.25vw", paddingTop:"0.5vh" }}>{equipo.nombre}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", paddingLeft: "1vw"}}>
                  <img src={getImagenEquipo(equipo.constructorId)} alt="Foto de equipo" style={{ width: "5vh", height: "5vh", objectFit:"contain", paddingRight:"1vw" }} />
                  <img src={`https://flagcdn.com/w160/${equipo.nacionalidad}.png`} alt={equipo.nacionalidad} style={{ width: "5vh", height: "5vh", objectFit:"contain" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                  <span style={{ fontSize: "3vh", color: "white", textAlign: "center" }}>{equipo.points} PTS.</span>
                </div>
              </div>
              <img src={getLivery(equipo.constructorId)} alt="Foto de equipo" style={{ width: "25vh", height: "15vh", objectFit:"contain", paddingLeft:"1.5vw", borderRadius:"1vh" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ClasificacionEquipos