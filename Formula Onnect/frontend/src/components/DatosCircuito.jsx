import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Containers.css";
import { carga } from './animacionCargando';

/**
 * Componente que muestra información detallada de un circuito de F1
 * Obtiene datos del backend y los renderiza en pantalla
 */
export const DatosCircuito = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Obtiene el ID del circuito desde el estado de navegación
  const { idCircuito } = location.state || {};
  // Estados para almacenar información del circuito y el estado de carga
  const [circuito, setCircuito] = useState({});
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Función que carga los datos del circuito desde el backend
    const cargarDatos = async () => {
      setCargando(true);
      try {
        const circuito = await cargarDatosCircuito(idCircuito);
        if (!circuito) {
          console.error("Circuito no encontrado");
          return;
        }
        setCircuito(circuito);
        // Pequeño delay para mostrar la animación de carga
        setTimeout(() => { setCargando(false); }, 500);
      } catch (error) {
        console.error("Error en la API", error);
      }
    };
    cargarDatos();
  }, [idCircuito]); // Se ejecuta cuando cambia el ID del circuito

  /**
   * Función para obtener los datos básicos del circuito desde el backend
   * @param {string} idCircuito - ID del circuito a consultar
   * @returns {Object} Datos del circuito
   */
  const cargarDatosCircuito = async (idCircuito) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/circuitos/${idCircuito}`);
      const data = response.data;
      if (!data) {
        console.error("Circuito no encontrado");
        return;
      }
      return data;
    } catch (error) {
      console.error("Error al obtener el circuito", error);
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

  /**
   * Calcula la longitud total de la carrera
   * @param {number} vueltas - Número de vueltas
   * @param {number} longitudCircuito - Longitud del circuito (Una vuelta) en km
   * @returns {string} Longitud total de la carrera en km
   */
  function getLongitudCarrera(vueltas, longitudCircuito) {
    return (vueltas * longitudCircuito).toFixed(3); // Redondea a 3 decimales
  }

  // Muestra animación de carga mientras se obtienen los datos
  if (cargando) { return carga(); }

  return (
    <div className='container_overflow'>
      <div className='container_fila_paddingTop_v5'>
        <button type='submit' onClick={handlePilotos} className='boton_fondo_15_v3'>Pilotos</button>
        <button type='submit' onClick={handleEquipos} className='boton_fondo_15_v4'>Equipos</button>
        <button type='submit' onClick={handleCircuitos} className='boton_fondo_c4'>Circuitos</button>
      </div>
      <br />
      <div className='container_overflow_border'>
        <p className='datos_v5'>{circuito.nombreCircuito}</p>
        <div className='container_columna_marginBottom_v2'>
          <img src={circuito.imagenCircuitos} alt="Foto del equipo" className='imagen_circuito'/>
          <div className='container_fila_marginBottom'>
            <img src={`https://flagcdn.com/w160/${circuito.isoPais}.png`} alt={circuito.isoPais} className='imagen_bandera'/>
            <p className='datos_v6'>{circuito.ciudad}, {circuito.pais}</p>
          </div>
        </div>
        <div className='container_columna_marginBottom'>
          <div className='container_columna_blanca'>
            <div className='container_fila_paddingBottom'>
              <div className='container_columna_datos'>
                <p className='datos_centrados_v2'>Primera carrera:</p>
                <p className='datos_centrados'>{circuito.primeraCarrera}</p>
              </div>
              <div className='container_columna_datos'>
                <p className='datos_centrados_v2'>Última carrera:</p>
                <p className='datos_centrados'>{circuito.ultimaCarrera}</p>
              </div>
              <div className='container_columna_datos'>
                <p className='datos_centrados_v2'>Record de pista:</p>
                <p className='datos_centrados'>{circuito.recordPista}</p>
              </div>
            </div>
            <div className='container_fila_paddingBottom'>
              <div className='container_columna_datos'>
                <p className='datos_centrados_v2'>Longitud del circuito:</p>
                <p className='datos_centrados'>{circuito.longitudCircuito} km</p>
              </div>
              <div className='container_columna_datos'>
                <p className='datos_centrados_v2'>Número de vueltas:</p>
                <p className='datos_centrados'>{circuito.vueltas}</p>
              </div>
              <div className='container_columna_datos'>
                <p className='datos_centrados_v2'>Longitud de carrera:</p>
                <p className='datos_centrados'>{getLongitudCarrera(circuito.vueltas, circuito.longitudCircuito)} km</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
    </div>
  )
}

export default DatosCircuito;