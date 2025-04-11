import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import '../styles/Containers.css';
import { carga } from './animacionCargando.jsx';
import { getImagenPiloto } from './mapeoImagenes.js';

export const DatosPiloto = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { idPiloto } = location.state || {};
  const [pilotos, setPilotos] = useState([]);
  const [driverData, setDriverData] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      try {
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
        setTimeout(() => { setCargando(false); }, 500);
      } catch (error) {
        console.error("Error en la API", error);
      }
    }
    cargarDatos();
  }, [idPiloto]);

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

  if (cargando) { return carga(); }

  return (
    <div className='container_columna_marginTop'>
      <div className='container_fila'>
        <button type='submit' onClick={handlePilotos} className='boton_fondo_c4_v2'>Pilotos</button>
        <button type='submit' onClick={handleEquipos} className='boton_fondo_15_v4'>Equipos</button>
        <button type='submit' onClick={handleCircuitos} className='boton_fondo_15_v4'>Circuitos</button>
      </div>
      <br />
      <div className='container_columna_2c_v4'>
        <div className='container_fila_2c'>
          <p className='datos_v7'>{pilotos.nombrePiloto} {pilotos.apellidoPiloto}</p>
        </div>
        <div className='container_fila_marginBottom'>
          <div className='container_columna_marginBottom_v2'>
            <img src={getImagenPiloto(pilotos.driverId)} alt="Imagen del piloto" className='imagen_piloto_v2'/>
            <div className='container_fila_marginBottom'>
              <img src={`https://flagcdn.com/w160/${pilotos.isoNacPil}.png`} alt={pilotos.isoNacPil} className='imagen_bandera'/>
              <p className='datos_v6'>{pilotos.nacionalidadPiloto}</p>
            </div>
          </div>
          <div className='container_columna_paddingLeft_v2'>
            {driverData && (
              <div className='container_columna_blanca'>
                <div className='container_fila_paddingBottom'>
                  <div className='container_columna_datos_v2'>
                    <p className='datos_centrados'>Fecha de nacimiento:</p>
                    <p className='datos_centrados'>{driverData.birthDate}</p>
                  </div>
                  <div className='container_columna_datos_v2'>
                    <p className='datos_centrados'>Lugar de nacimiento:</p>
                    <p className='datos_centrados'>{driverData.birthPlace}</p>
                  </div>
                  <div className='container_columna_datos_v2'>
                    <p className='datos_centrados'>Fecha de fallecimiento:</p>
                    <p className='datos_centrados'>{driverData.deathDate}</p>
                  </div>
                  <div className='container_columna_datos_v2'>
                    <p className='datos_centrados'>Lugar de fallecimiento:</p>
                    <p className='datos_centrados'>{driverData.deathPlace}</p>
                  </div>
                </div>
                <div className='container_fila_paddingBottom'>
                  <div className='container_columna_datos_v2'>
                    <p className='datos_centrados'>Primera carrera:</p>
                    <p className='datos_centrados'>{driverData.firstRace}</p>
                  </div>
                  <div className='container_columna_datos_v2'>
                    <p className='datos_centrados'>Primera Victoria:</p>
                    <p className='datos_centrados'>{driverData.firstWin}</p>
                  </div>
                  <div className='container_columna_datos_v2'>
                    <p className='datos_centrados'>Última carrera:</p>
                    <p className='datos_centrados'>{driverData.lastRace}</p>
                  </div>
                  <div className='container_columna_datos_v2'>
                    <p className='datos_centrados'>Carreras terminadas:</p>
                    <p className='datos_centrados'>{driverData.racesFinished}</p>
                  </div>
                </div>
                <div className='container_fila_paddingBottom'>
                  <div className='container_columna_datos_v2'>
                    <p className='datos_centrados'>Victorias:</p>
                    <p className='datos_centrados'>{driverData.wins}</p>
                  </div>
                  <div className='container_columna_datos_v2'>
                    <p className='datos_centrados'>Poles:</p>
                    <p className='datos_centrados'>{driverData.poles}</p>
                  </div>
                  <div className='container_columna_datos_v2'>
                    <p className='datos_centrados'>Vueltas rápidas:</p>
                    <p className='datos_centrados'>{driverData.fastestLaps}</p>
                  </div>
                  <div className='container_columna_datos_v2'>
                    <p className='datos_centrados'>Podios:</p>
                    <p className='datos_centrados'>{driverData.podiums}</p>
                  </div>
                </div>
                <div className='container_fila_paddingBottom'>
                  <div className='container_columna_datos_v2'>
                    <p className='datos_centrados'>Mundiales:</p>
                    <p className='datos_centrados'>{driverData.championships}</p>
                  </div>
                  <div className='container_columna_datos_v2'>
                    <p className='datos_centrados'>Puntos totales:</p>
                    <p className='datos_centrados'>{driverData.points}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DatosPiloto;