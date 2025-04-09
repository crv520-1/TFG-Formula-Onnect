import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Containers.css";
import { carga } from './animacionCargando.jsx';
import { getImagenEquipo, getLivery } from './mapeoImagenes.js';

export const DatosEquipo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { idEquipo } = location.state || {};
  const [equipo, setEquipo] = useState({});
  const [equipoData, setEquipoData] = useState({});
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setCargando(true);
      try {
        const equipo = await cargarDatosEquipo(idEquipo);
        if (!equipo) {
          console.error("Equipo no encontrado");
          return;
        }
        setEquipo(equipo);

        // Consultar la wikipedia con la url del equipo para obtener los datos de interés
        const scraperResponse = await cargarDatosScraping(equipo.urlEquipo, equipo.urlCastellano);
        if (!scraperResponse) {
          console.error("Datos de scraping no encontrados");
          return;
        }
        setEquipoData(scraperResponse);
        setTimeout(() => { setCargando(false); }, 500);
      } catch (error) {
        console.error("Error en la API", error);
      }
    }
    fetchData();
  }, [idEquipo]);

  const cargarDatosEquipo = async (idEquipo) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/equipos/${idEquipo}`);
      const data = response.data;
      if (!data) {
        console.error("Equipo no encontrado");
        return;
      }
      return data;
    } catch (error) {
      console.error("Error al obtener el equipo", error);
    }
  };
  
  const cargarDatosScraping = async (urlEquipo, urlCastellano) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/scrapingEquipos/equipo-data`, {
        params: { index: 0, urlEng: urlEquipo, urlEsp: urlCastellano }
      });
      const data = response.data;
      if (!data) {
        console.error("Datos de scraping no encontrados");
        return;
      }
      return data;
    } catch (error) {
      console.error("Error al obtener los datos de scraping", error);
    }
  };

  const handlePilotos = (e) => {
    e.preventDefault();
    navigate("/GuiaPilotos");
  }

  const handleEquipos = (e) => {
    e.preventDefault();
    navigate("/GuiaEquipos");
  }

  const handleCircuitos = (e) => {
    e.preventDefault();
    navigate("/GuiaCircuitos");
  }

  if (cargando) { 
    return carga(); 
  }

  return (
    <div className='container_overflow'>
      <div className='container_fila_paddingTop_v5'>
        <button type='submit' onClick={handlePilotos} style={{ fontSize: "2vh", height:"3vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border:"none", backgroundColor:"#15151E" }}>Pilotos</button>
        <button type='submit' onClick={handleEquipos} style={{ fontSize: "2vh", height:"3vh", marginLeft: "20vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border:"none", backgroundColor:"#C40000", width:"15vh" }}>Equipos</button>
        <button type='submit' onClick={handleCircuitos} style={{ fontSize: "2vh", height:"3vh", marginLeft: "20vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", border:"none", backgroundColor:"#15151E" }}>Circuitos</button>
      </div>
      <br />
      <div className='container_overflow_border'>
        <div className='container_fila_heightAuto'>
          <img src={getImagenEquipo(equipo.constructorId)} alt="Foto del equipo" style={{ width: "8vh", height: "5vh", objectFit:"contain" }} />
          <p style={{ fontSize: "3vh", textAlign: "center", color: "white", paddingLeft:"1vw" }}>{equipo.nombreEquipo}</p>
        </div>
        <div className='container_columna_marginBottom_v2'>
          <img src={getLivery(equipo.constructorId)} alt="Imagen del equipo" style={{ width: "50vh", height: "30vh", objectFit:"contain"}} />
          <div className='container_fila_marginBottom'>
            <img src={`https://flagcdn.com/w160/${equipo.isoNacEqui}.png`} alt={equipo.isoNacEqui} style={{ width: "6vh", height: "4vh" }} />
            <p style={{ fontSize: "2vh", textAlign: "center", color: "white", paddingLeft:"0.5vw" }}>{equipo.nacionalidadEquipo}</p>
          </div>
        </div>
        <div className='container_columna_marginBottom'>
          {equipoData && (
            <div className='container_columna_blanca'>
              <div className='container_fila_paddingBottom'>
                <div className='container_columna_datos'>
                  <p style={{ textAlign: "center" }}>Fundadores:</p>
                  <p style={{ textAlign: "center" }}>{equipoData.founders}</p>
                </div>
                <div className='container_columna_datos'>
                  <p style={{ textAlign: "center" }}>Primera carrera:</p>
                  <p style={{ textAlign: "center" }}>{equipoData.firstRace}</p>
                </div>
                <div className='container_columna_datos'>
                  <p style={{ textAlign: "center" }}>Última carrera:</p>
                  <p style={{ textAlign: "center" }}>{equipoData.lastRace}</p>
                </div>
                <div className='container_columna_datos'>
                  <p style={{ textAlign: "center" }}>Carreras terminadas:</p>
                  <p style={{ textAlign: "center" }}>{equipoData.racesFinished}</p>
                </div>
              </div>
              <div className='container_fila_paddingBottom'>
                <div className='container_columna_datos'>
                  <p style={{ textAlign: "center" }}>Mundiales de Constructores:</p>
                  <p style={{ textAlign: "center" }}>{equipoData.constructorChampionships}</p>
                </div>
                <div className='container_columna_datos'>
                  <p style={{ textAlign: "center" }}>Mundiales de Pilotos:</p>
                  <p style={{ textAlign: "center" }}>{equipoData.driverChampionships}</p>
                </div>
                <div className='container_columna_datos'>
                  <p style={{ textAlign: "center" }}>Victorias:</p>
                  <p style={{ textAlign: "center" }}>{equipoData.wins}</p>
                </div>
                <div className='container_columna_datos'>
                  <p style={{ textAlign: "center" }}>Puntos totales:</p>
                  <p style={{ textAlign: "center" }}>{equipoData.points}</p>
                </div>
              </div>
              <div className='container_fila_paddingBottom'>
                <div className='container_columna_datos'>
                  <p style={{ textAlign: "center" }}>Poles:</p>
                  <p style={{ textAlign: "center" }}>{equipoData.poles}</p>
                </div>
                <div className='container_columna_datos'>
                  <p style={{ textAlign: "center" }}>Podios:</p>
                  <p style={{ textAlign: "center" }}>{equipoData.podiums}</p>
                </div>
                <div className='container_columna_datos'>
                  <p style={{ textAlign: "center" }}>Vueltas rápidas:</p>
                  <p style={{ textAlign: "center" }}>{equipoData.fastestLaps}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DatosEquipo;