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
          <p style={{ fontSize: "3vh", textAlign: "center", color: "white" }}>{pilotos.nombrePiloto}</p>
          <p style={{ fontSize: "3vh", textAlign: "center", color: "white", paddingLeft:"0.5vw" }}>{pilotos.apellidoPiloto}</p>
        </div>
        <div className='container_fila_marginBottom'>
          <div className='container_columna_marginBottom_v2'>
            <img src={getImagenPiloto(pilotos.driverId)} alt="Imagen del piloto" style={{ width: "30vh", height: "30vh", objectFit:"contain"}} />
            <div className='container_columna_marginBottom_v2'>
              <img src={`https://flagcdn.com/w160/${pilotos.isoNacPil}.png`} alt={pilotos.isoNacPil} style={{ width: "6vh", height: "4vh" }} />
              <p style={{ fontSize: "2vh", textAlign: "center", color: "white", paddingLeft:"0.5vw" }}>{pilotos.nacionalidadPiloto}</p>
            </div>
          </div>
          <div className='container_columna_paddingLeft_v2'>
            {driverData && (
              <div className='container_columna_blanca'>
                <div className='container_fila_paddingBottom'>
                  <div className='container_columna_datos_v2'>
                    <p style={{ textAlign: "center" }}>Fecha de nacimiento:</p>
                    <p style={{ textAlign: "center" }}>{driverData.birthDate}</p>
                  </div>
                  <div className='container_columna_datos_v2'>
                    <p style={{ textAlign: "center" }}>Lugar de nacimiento:</p>
                    <p style={{ textAlign: "center" }}>{driverData.birthPlace}</p>
                  </div>
                  <div className='container_columna_datos_v2'>
                    <p style={{ textAlign: "center" }}>Fecha de fallecimiento:</p>
                    <p style={{ textAlign: "center" }}>{driverData.deathDate}</p>
                  </div>
                  <div className='container_columna_datos_v2'>
                    <p style={{ textAlign: "center" }}>Lugar de fallecimiento:</p>
                    <p style={{ textAlign: "center" }}>{driverData.deathPlace}</p>
                  </div>
                </div>
                <div className='container_fila_paddingBottom'>
                  <div className='container_columna_datos_v2'>
                    <p style={{ textAlign: "center" }}>Primera carrera:</p>
                    <p style={{ textAlign: "center" }}>{driverData.firstRace}</p>
                  </div>
                  <div className='container_columna_datos_v2'>
                    <p style={{ textAlign: "center" }}>Primera Victoria:</p>
                    <p style={{ textAlign: "center" }}>{driverData.firstWin}</p>
                  </div>
                  <div className='container_columna_datos_v2'>
                    <p style={{ textAlign: "center" }}>Última carrera:</p>
                    <p style={{ textAlign: "center" }}>{driverData.lastRace}</p>
                  </div>
                  <div className='container_columna_datos_v2'>
                    <p style={{ textAlign: "center" }}>Carreras terminadas:</p>
                    <p style={{ textAlign: "center" }}>{driverData.racesFinished}</p>
                  </div>
                </div>
                <div className='container_fila_paddingBottom'>
                  <div className='container_columna_datos_v2'>
                    <p style={{ textAlign: "center" }}>Victorias:</p>
                    <p style={{ textAlign: "center" }}>{driverData.wins}</p>
                  </div>
                  <div className='container_columna_datos_v2'>
                    <p style={{ textAlign: "center" }}>Poles:</p>
                    <p style={{ textAlign: "center" }}>{driverData.poles}</p>
                  </div>
                  <div className='container_columna_datos_v2'>
                    <p style={{ textAlign: "center" }}>Vueltas rápidas:</p>
                    <p style={{ textAlign: "center" }}>{driverData.fastestLaps}</p>
                  </div>
                  <div className='container_columna_datos_v2'>
                    <p style={{ textAlign: "center" }}>Podios:</p>
                    <p style={{ textAlign: "center" }}>{driverData.podiums}</p>
                  </div>
                </div>
                <div className='container_fila_paddingBottom'>
                  <div className='container_columna_datos_v2'>
                    <p style={{ textAlign: "center" }}>Mundiales:</p>
                    <p style={{ textAlign: "center" }}>{driverData.championships}</p>
                  </div>
                  <div className='container_columna_datos_v2'>
                    <p style={{ textAlign: "center" }}>Puntos totales:</p>
                    <p style={{ textAlign: "center" }}>{driverData.points}</p>
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