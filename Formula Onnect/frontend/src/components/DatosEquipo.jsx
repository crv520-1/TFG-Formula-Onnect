import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Containers.css";
import { carga } from './animacionCargando.jsx';

/**
 * Componente que muestra información detallada de un equipo de F1
 * Obtiene datos del backend y realiza scraping de Wikipedia
 */
export const DatosEquipo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Obtiene el ID del equipo desde el estado de navegación
  const { idEquipo } = location.state || {};
  // Estados para almacenar información
  const [equipo, setEquipo] = useState({});
  const [equipoData, setEquipoData] = useState({});
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Función que carga los datos del equipo y realiza scraping
    const fetchData = async () => {
      setCargando(true);
      try {
        // Carga datos básicos del equipo desde el backend
        const equipo = await cargarDatosEquipo(idEquipo);
        if (!equipo) {
          console.error("Equipo no encontrado");
          return;
        }
        setEquipo(equipo);

        // Consulta Wikipedia para obtener datos adicionales del equipo
        const scraperResponse = await cargarDatosScraping(equipo.urlEquipo, equipo.urlCastellano);
        if (!scraperResponse) {
          console.error("Datos de scraping no encontrados");
          return;
        }
        setEquipoData(scraperResponse);
        // Pequeño delay para mostrar la animación de carga
        setTimeout(() => { setCargando(false); }, 500);
      } catch (error) {
        console.error("Error en la API", error);
      }
    }
    fetchData();
  }, [idEquipo]); // Se ejecuta cuando cambia el ID del equipo

  /**
   * Función para obtener los datos básicos del equipo desde el backend
   * @param {string} idEquipo - ID del equipo a consultar
   * @returns {Object} Datos del equipo
   */
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
  
  /**
   * Función para obtener datos detallados mediante scraping de Wikipedia
   * @param {string} urlEquipo - URL en inglés del equipo
   * @param {string} urlCastellano - URL en español del equipo
   * @returns {Object} Datos extraídos por scraping
   * Se analiza la URL en español y si faltan datos se obtienen con la URL en inglés
   */
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

  // Funciones de navegación para la barra de menú
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

  // Muestra animación de carga mientras se obtienen los datos
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
          <img src={equipo.imagenEquipos} alt="Foto del equipo" className='imagen_equipo_v3'/>
          <p className='datos_v5'>{equipo.nombreEquipo}</p>
        </div>
        <div className='container_columna_marginBottom_v2'>
          <img src={equipo.imagenLivery} alt="Imagen del equipo" className='imagen_livery_v2'/>
          <div className='container_fila_marginBottom'>
            <img src={`https://flagcdn.com/w160/${equipo.isoNacEqui}.png`} alt={equipo.isoNacEqui} className='imagen_bandera'/>
            <p className='datos_v6'>{equipo.nacionalidadEquipo}</p>
          </div>
        </div>
        <div className='container_columna_marginBottom'>
          {equipoData && (
            <div className='container_columna_blanca'>
              <div className='container_fila_paddingBottom'>
                <div className='container_columna_datos'>
                  <p className='datos_centrados_v2'>Fundadores:</p>
                  <p className='datos_centrados'>{equipoData.founders}</p>
                </div>
                <div className='container_columna_datos'>
                  <p className='datos_centrados_v2'>Primera carrera:</p>
                  <p className='datos_centrados'>{equipoData.firstRace}</p>
                </div>
                <div className='container_columna_datos'>
                  <p className='datos_centrados_v2'>Última carrera:</p>
                  <p className='datos_centrados'>{equipoData.lastRace}</p>
                </div>
                <div className='container_columna_datos'>
                  <p className='datos_centrados_v2'>Carreras terminadas:</p>
                  <p className='datos_centrados'>{equipoData.racesFinished}</p>
                </div>
              </div>
              <div className='container_fila_paddingBottom'>
                <div className='container_columna_datos'>
                  <p className='datos_centrados_v2'>Mundiales de Constructores:</p>
                  <p className='datos_centrados'>{equipoData.constructorChampionships}</p>
                </div>
                <div className='container_columna_datos'>
                  <p className='datos_centrados_v2'>Mundiales de Pilotos:</p>
                  <p className='datos_centrados'>{equipoData.driverChampionships}</p>
                </div>
                <div className='container_columna_datos'>
                  <p className='datos_centrados_v2'>Victorias:</p>
                  <p className='datos_centrados'>{equipoData.wins}</p>
                </div>
                <div className='container_columna_datos'>
                  <p className='datos_centrados_v2'>Puntos totales:</p>
                  <p className='datos_centrados'>{equipoData.points}</p>
                </div>
              </div>
              <div className='container_fila_paddingBottom'>
                <div className='container_columna_datos'>
                  <p className='datos_centrados_v2'>Poles:</p>
                  <p className='datos_centrados'>{equipoData.poles}</p>
                </div>
                <div className='container_columna_datos'>
                  <p className='datos_centrados_v2'>Podios:</p>
                  <p className='datos_centrados'>{equipoData.podiums}</p>
                </div>
                <div className='container_columna_datos'>
                  <p className='datos_centrados_v2'>Vueltas rápidas:</p>
                  <p className='datos_centrados'>{equipoData.fastestLaps}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <br />
    </div>
  )
}

export default DatosEquipo;