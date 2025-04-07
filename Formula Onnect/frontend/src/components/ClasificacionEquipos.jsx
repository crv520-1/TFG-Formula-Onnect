import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { getPaisISO } from '../../../backend/scripts/mapeoPaises';
import '../styles/Containers.css';
import { carga } from './animacionCargando';
import { getImagenEquipo, getLivery } from './mapeoImagenes';

export const ClasificacionEquipos = () => {
  const navigate = useNavigate();
  const [year, setYear] = useState(2025);
  const [clasificacion, setClasificacion] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      try {
        const standings = await obtenerClasificacion(year);
        setClasificacion(standings);
        setTimeout(() => {
          setCargando(false);
        }, 500);
      } catch (error) {
        console.error("Error en la API", error);
      }
    };
    cargarDatos();
  }, [year]);

  const obtenerClasificacion = async (year) => {
    try {
      const response = await axios.get(`https://api.jolpi.ca/ergast/f1/${year}/constructorstandings.json`);
      const data = response.data.MRData.StandingsTable.StandingsLists[0];
      return data.ConstructorStandings.map(equipo => ({
        position: equipo.position,
        points: equipo.points,
        constructorId: equipo.Constructor.constructorId,
        nombre: equipo.Constructor.name,
        nacionalidad: getPaisISO(equipo.Constructor.nationality)
      }));
    } catch (error) {
      console.error("Error al obtener la clasificación", error);
    }
  };

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
    if (posicion <= 3) return "bold";
    return "normal";
  }

  if (cargando) { return ( carga() )};
    
  return (
    <div className='container_overflow'>
      <div className='container_fila'>
        <button type='submit' onClick={handlePilotos} style={{ fontSize: "2vh", height:"3vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor:"#15151E", border: "none" }}>Pilotos</button>
        <h2 style={{ backgroundColor: "#C40000", borderRadius:"0.5vh", width: "15vh", fontSize:"2vh", textAlign: "center", marginLeft: "35vh" }}>Equipos</h2>
      </div> 
      <div className='container_fila'>
        {/* Seleccionable para elegir el año */}
        <select style={{ borderRadius: "2vh", margin: "1vh", padding: "1vh", border:"none", backgroundColor:"#2C2C2C", color:"white", fontSize:"1.25vh" }} onChange={(e) => setYear(e.target.value)} value={year}>
          {years.map(year => ( <option key={year} value={year}>{year}</option> ))}
        </select>
      </div>
      <div className='container_overflow_padding'>
        <div className='container_grid_v2'>
          {clasificacion.map((equipo, index) => (
            <div key={equipo.constructorId} style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", backgroundColor:"#2c2c2c", borderRadius:"1vh", gap: "1vh", width:"22vw", justifyContent: "space-between",  ...(clasificacion.length % 2 !== 0 && index === clasificacion.length - 1 ? { gridColumn: "1 / span 2", justifySelf: "center" } : {}) }}>
              <div className='container_columna_v3'>
                <div className='container_fila_marginLeft'>
                  <span style={{ fontSize: "2.5vh", color: getColorPosicion(Number(equipo.position)), textAlign: "center", paddingBottom:"1vh", fontWeight:getEstiloPosicion(Number(equipo.position)) }}>{equipo.position ? equipo.position : "-"}. </span>
                  <span style={{ fontSize: "2vh", color: "white", textAlign: "center", paddingLeft:"0.25vw", paddingTop:"0.5vh" }}>{equipo.nombre}</span>
                </div>
                <div className='container_fila_marginLeft_v2'>
                  <img src={getImagenEquipo(equipo.constructorId)} alt="Foto de equipo" style={{ width: "5vh", height: "5vh", objectFit:"contain", paddingRight:"1vw" }} />
                  <img src={`https://flagcdn.com/w160/${equipo.nacionalidad}.png`} alt={equipo.nacionalidad} style={{ width: "5vh", height: "5vh", objectFit:"contain" }} />
                </div>
                <div className='container_fila'>
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