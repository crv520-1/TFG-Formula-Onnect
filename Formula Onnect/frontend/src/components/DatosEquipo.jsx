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
        <button type='submit' onClick={handlePilotos} className='boton_fondo_15_v3'>Pilotos</button>
        <button type='submit' onClick={handleEquipos} className='boton_fondo_c4'>Equipos</button>
        <button type='submit' onClick={handleCircuitos} className='boton_fondo_15_v4'>Circuitos</button>
      </div>
      <br />
      <div className='container_overflow_border'>
        <div className='container_fila_heightAuto'>
          <img src={getImagenEquipo(equipo.constructorId)} alt="Foto del equipo" style={{ width: "8vh", height: "5vh", objectFit:"contain" }} />
          <p className='datos_v5'>{equipo.nombreEquipo}</p>
        </div>
        <div className='container_columna_marginBottom_v2'>
          <img src={getLivery(equipo.constructorId)} alt="Imagen del equipo" style={{ width: "50vh", height: "30vh", objectFit:"contain"}} />
          <div className='container_fila_marginBottom'>
            <img src={`https://flagcdn.com/w160/${equipo.isoNacEqui}.png`} alt={equipo.isoNacEqui} style={{ width: "6vh", height: "4vh" }} />
            <p className='datos_v6'>{equipo.nacionalidadEquipo}</p>
          </div>
        </div>
        <div className='container_columna_marginBottom'>
          {equipoData && (
            <div className='container_columna_blanca'>
              <div className='container_fila_paddingBottom'>
                <div className='container_columna_datos'>
                  <p className='datos_centrados'>Fundadores:</p>
                  <p className='datos_centrados'>{equipoData.founders}</p>
                </div>
                <div className='container_columna_datos'>
                  <p className='datos_centrados'>Primera carrera:</p>
                  <p className='datos_centrados'>{equipoData.firstRace}</p>
                </div>
                <div className='container_columna_datos'>
                  <p className='datos_centrados'>Última carrera:</p>
                  <p className='datos_centrados'>{equipoData.lastRace}</p>
                </div>
                <div className='container_columna_datos'>
                  <p className='datos_centrados'>Carreras terminadas:</p>
                  <p className='datos_centrados'>{equipoData.racesFinished}</p>
                </div>
              </div>
              <div className='container_fila_paddingBottom'>
                <div className='container_columna_datos'>
                  <p className='datos_centrados'>Mundiales de Constructores:</p>
                  <p className='datos_centrados'>{equipoData.constructorChampionships}</p>
                </div>
                <div className='container_columna_datos'>
                  <p className='datos_centrados'>Mundiales de Pilotos:</p>
                  <p className='datos_centrados'>{equipoData.driverChampionships}</p>
                </div>
                <div className='container_columna_datos'>
                  <p className='datos_centrados'>Victorias:</p>
                  <p className='datos_centrados'>{equipoData.wins}</p>
                </div>
                <div className='container_columna_datos'>
                  <p className='datos_centrados'>Puntos totales:</p>
                  <p className='datos_centrados'>{equipoData.points}</p>
                </div>
              </div>
              <div className='container_fila_paddingBottom'>
                <div className='container_columna_datos'>
                  <p className='datos_centrados'>Poles:</p>
                  <p className='datos_centrados'>{equipoData.poles}</p>
                </div>
                <div className='container_columna_datos'>
                  <p className='datos_centrados'>Podios:</p>
                  <p className='datos_centrados'>{equipoData.podiums}</p>
                </div>
                <div className='container_columna_datos'>
                  <p className='datos_centrados'>Vueltas rápidas:</p>
                  <p className='datos_centrados'>{equipoData.fastestLaps}</p>
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