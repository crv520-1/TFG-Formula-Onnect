import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import '../styles/Containers.css';
import { carga } from './animacionCargando.jsx';

/**
 * Componente que muestra información detallada de un piloto de F1
 * Obtiene datos del backend y realiza scraping de Wikipedia
 */
export const DatosPiloto = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Obtiene el ID del piloto desde el estado de navegación
  const { idPiloto } = location.state || {};
  // Estados para almacenar información
  const [pilotos, setPilotos] = useState([]);
  const [driverData, setDriverData] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Función que carga los datos del piloto y realiza scraping
    const cargarDatos = async () => {
      setCargando(true);
      try {
        // Carga datos básicos del piloto desde el backend
        const piloto = await cargarDatosPiloto(idPiloto);
        if (!piloto) {
          console.error("Piloto no encontrado");
          return;
        }
        setPilotos(piloto);

        // Consultar la wikipedia con la url del piloto para obtener los datos de interés
        const scraperResponse = await cargarDatosScraping(piloto.urlPiloto);
        if (!scraperResponse) {
          console.error("Datos de scraping no encontrados");
          return;
        }
        setDriverData(scraperResponse);
        // Pequeño delay para mostrar la animación de carga
        setTimeout(() => { setCargando(false); }, 500);
      } catch (error) {
        console.error("Error en la API", error);
      }
    }
    cargarDatos();
  }, [idPiloto]); // Se ejecuta cuando cambia el ID del piloto

  /**
   * Función para obtener los datos básicos del piloto desde el backend
   * @param {string} idPiloto - ID del piloto a consultar
   * @returns {Object} Datos del piloto
   */
  const cargarDatosPiloto = async (idPiloto) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/pilotos/${idPiloto}`);
      const data = response.data;
      if (!data) {
        console.error("Piloto no encontrado");
        return;
      }
      return data;
    } catch (error) {
      console.error("Error al obtener el piloto", error);
    }
  };

  /**
   * Función para obtener datos detallados mediante scraping de Wikipedia
   * @param {string} url - URL de Wikipedia del piloto
   * @returns {Object} Datos extraídos por scraping
   */
  const cargarDatosScraping = async (url) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/scrapingPilotos/driver-data`, {
        params: { url }
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
  if (cargando) { return carga(); }

  return (
    <div className='container_overflow'>
      <div className='container_fila_paddingTop_v5'>
        <button type='submit' onClick={handlePilotos} className='boton_fondo_c4_v2'>Pilotos</button>
        <button type='submit' onClick={handleEquipos} className='boton_fondo_15_v4'>Equipos</button>
        <button type='submit' onClick={handleCircuitos} className='boton_fondo_15_v4'>Circuitos</button>
      </div>
      <br />
      <div className='container_overflow_border'>
        <div className='container_fila_2c'>
          <p className='datos_v7'>{pilotos.nombrePiloto} {pilotos.apellidoPiloto}</p>
        </div>
          <div className='container_columna_marginBottom_v2'>
            <img src={pilotos.imagenPilotos} alt="Imagen del piloto" className='imagen_piloto_v2'/>
            <div className='container_fila_marginBottom'>
              <img src={`https://flagcdn.com/w160/${pilotos.isoNacPil}.png`} alt={pilotos.isoNacPil} className='imagen_bandera'/>
              <p className='datos_v6'>{pilotos.nacionalidadPiloto}</p>
            </div>
          </div>
          <div className='container_columna_paddingLeft_v2'>
            {driverData && (
              <div className='container_columna_blanca'>
                <div className='container_fila_paddingBottom'>
                  <div className='container_columna_datos'>
                    <p className='datos_centrados_v2'>Fecha de nacimiento:</p>
                    <p className='datos_centrados'>{driverData.birthDate}</p>
                  </div>
                  <div className='container_columna_datos'>
                    <p className='datos_centrados_v2'>Lugar de nacimiento:</p>
                    <p className='datos_centrados'>{driverData.birthPlace}</p>
                  </div>
                  <div className='container_columna_datos'>
                    <p className='datos_centrados_v2'>Fecha de fallecimiento:</p>
                    <p className='datos_centrados'>{driverData.deathDate}</p>
                  </div>
                  <div className='container_columna_datos'>
                    <p className='datos_centrados_v2'>Lugar de fallecimiento:</p>
                    <p className='datos_centrados'>{driverData.deathPlace}</p>
                  </div>
                </div>
                <div className='container_fila_paddingBottom'>
                  <div className='container_columna_datos'>
                    <p className='datos_centrados_v2'>Primera carrera:</p>
                    <p className='datos_centrados'>{driverData.firstRace}</p>
                  </div>
                  <div className='container_columna_datos'>
                    <p className='datos_centrados_v2'>Primera Victoria:</p>
                    <p className='datos_centrados'>{driverData.firstWin}</p>
                  </div>
                  <div className='container_columna_datos'>
                    <p className='datos_centrados_v2'>Última carrera:</p>
                    <p className='datos_centrados'>{driverData.lastRace}</p>
                  </div>
                  <div className='container_columna_datos'>
                    <p className='datos_centrados_v2'>Carreras terminadas:</p>
                    <p className='datos_centrados'>{driverData.racesFinished}</p>
                  </div>
                </div>
                <div className='container_fila_paddingBottom'>
                  <div className='container_columna_datos'>
                    <p className='datos_centrados_v2'>Victorias:</p>
                    <p className='datos_centrados'>{driverData.wins}</p>
                  </div>
                  <div className='container_columna_datos'>
                    <p className='datos_centrados_v2'>Poles:</p>
                    <p className='datos_centrados'>{driverData.poles}</p>
                  </div>
                  <div className='container_columna_datos'>
                    <p className='datos_centrados_v2'>Vueltas rápidas:</p>
                    <p className='datos_centrados'>{driverData.fastestLaps}</p>
                  </div>
                  <div className='container_columna_datos'>
                    <p className='datos_centrados_v2'>Podios:</p>
                    <p className='datos_centrados'>{driverData.podiums}</p>
                  </div>
                </div>
                <div className='container_fila_paddingBottom'>
                  <div className='container_columna_datos'>
                    <p className='datos_centrados_v2'>Mundiales:</p>
                    <p className='datos_centrados'>{driverData.championships}</p>
                  </div>
                  <div className='container_columna_datos'>
                    <p className='datos_centrados_v2'>Puntos totales:</p>
                    <p className='datos_centrados'>{driverData.points}</p>
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

export default DatosPiloto;