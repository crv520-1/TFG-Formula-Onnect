import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { getPaisISO } from '../../../backend/scripts/mapeoPaises';
import { carga } from './animacionCargando';
import { getImagenEquipo, getImagenPiloto } from './mapeoImagenes';

export const Clasificacion = () => {
  const navigate = useNavigate();
  const [year, setYear] = useState(2025);
  const [clasificacion, setClasificacion] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      try {
        const standings = await cargarClasificacionPilotos(year);
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

  const cargarClasificacionPilotos = async (year) => {
    try {
      const response = await axios.get(`https://api.jolpi.ca/ergast/f1/${year}/driverstandings.json`);
      const data = response.data.MRData.StandingsTable.StandingsLists[0];
      return data.DriverStandings.map(piloto => ({
        position: piloto.position,
        points: piloto.points,
        driverId: piloto.Driver.driverId,
        nombre: piloto.Driver.givenName,
        apellido: piloto.Driver.familyName,
        nacionalidad: getPaisISO(piloto.Driver.nationality),
        numero: piloto.Driver.permanentNumber,
        constructorName: piloto.Constructors[0].name,
        constructorId: piloto.Constructors[0].constructorId
      }));
    } catch (error) {
      console.error("Error al obtener la clasificación", error);
    }
  };

  const handleEquipos = (e) => {
    e.preventDefault();
    navigate("/ClasificacionEquipos");
    console.log("Equipos");
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
    <div style={{ display: "flex", flexDirection: "column", maxHeight: "98vh", overflow: "auto" }}>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} >
        <h2 style={{ backgroundColor: "#C40000", borderRadius:"0.5vh", width: "15vh", fontSize:"2vh", textAlign: "center" }}>Pilotos</h2>
        <button type='submit' onClick={handleEquipos} style={{ fontSize: "2vh", height:"3vh", marginLeft: "35vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor:"#15151E", border: "none" }}>Equipos</button>
      </div>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        {/* Seleccionable para elegir el año */}
        <select style={{ borderRadius: "2vh", margin: "1vh", padding: "1vh", border:"none", backgroundColor:"#2C2C2C", color:"white", fontSize:"1.25vh" }} onChange={(e) => setYear(e.target.value)} value={year}>
          {years.map(year => ( <option key={year} value={year}>{year}</option> ))}
        </select>
      </div>
      <div style={{ display: "flex", flexDirection: "column", maxHeight: "100%", overflow: "auto", padding:"2vh" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2vh" }}>
          {clasificacion.map((piloto, index) => (
            <div key={piloto.driverId} style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", backgroundColor:"#2c2c2c", borderRadius:"1vh", gap: "1vh", width:"24vw",  ...(clasificacion.length % 2 !== 0 && index === clasificacion.length - 1 ? { gridColumn: "1 / span 2", justifySelf: "center" } : {}) }}>
              <div style={{ display: "flex", flexDirection: "column", paddingLeft: "1vw" }}>
                <span style={{ fontSize: "2.5vh", color: getColorPosicion(Number(piloto.position)), textAlign: "center", paddingBottom:"1vh", fontWeight:getEstiloPosicion(Number(piloto.position)) }}>{piloto.position ? piloto.position : "-"}. </span>
                <span style={{ fontSize: "1.75vh", color: "white", textAlign: "center" }}>{piloto.nombre}</span>
                <span style={{ fontSize: "1.75vh", color: "white", textAlign: "center", fontWeight:"bold" }}>{piloto.apellido}</span>
                <span style={{ fontSize: "1.5vh", color: "#aaa", textAlign: "center", paddingTop:"1vh" }}>{piloto.constructorName}</span>
              </div>
              <img src={getImagenPiloto(piloto.driverId)} alt="Foto de piloto" style={{ width: "15vh", height: "15vh", objectFit:"contain", paddingTop:"1vh" }} />
              <div style={{ display: "flex", flexDirection: "column", paddingRight: "1vw" }}>
                <span style={{ fontSize: "2vh", color: "white", textAlign: "center" }}>#{piloto.numero} </span>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                  <img src={getImagenEquipo(piloto.constructorId)} alt="Foto de equipo" style={{ width: "5vh", height: "5vh", objectFit:"contain", paddingRight:"1vw" }} />
                  <img src={`https://flagcdn.com/w160/${piloto.nacionalidad}.png`} alt={piloto.nacionalidad} style={{ width: "5vh", height: "5vh", objectFit:"contain" }} />
                </div>
                <span style={{ fontSize: "3vh", color: "white", textAlign: "center" }}>{piloto.points} PTS.</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Clasificacion;
