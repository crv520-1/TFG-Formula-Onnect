import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { getPaisISO } from '../../../backend/scripts/mapeoPaises';
import '../styles/Containers.css';
import '../styles/Textos.css';
import { carga } from './animacionCargando';
import { getImagenEquipo, getLivery } from './mapeoImagenes';

/**
 * Componente que muestra la clasificación de equipos de F1
 * Obtiene datos de una API y permite seleccionar el año
 */
export const ClasificacionEquipos = () => {
  const navigate = useNavigate();
  const [year, setYear] = useState(2025);
  const [clasificacion, setClasificacion] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Carga los datos de clasificación al cambiar el año
    const cargarDatos = async () => {
      setCargando(true);
      try {
        const standings = await obtenerClasificacion(year);
        setClasificacion(standings);
        setTimeout(() => { setCargando(false); }, 500); // Simula un pequeño retraso
      } catch (error) {
        console.error("Error en la API", error);
      }
    };
    cargarDatos();
  }, [year]);

  /**
   * Obtiene la clasificación de equipos desde la API
   * @param {number} year - Año a consultar
   * @returns {Array} Datos de clasificación del mundial
   */
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

  /**
   * Navega a la página de clasificación de pilotos
   */
  const handlePilotos = (e) => {
    e.preventDefault();
    navigate("/Clasificacion");
  }

  // Obtiene el año actual
  const currentYear = new Date().getFullYear();

  // Calcula la longitud del array de años
  const length = (currentYear - 2000) + 1;

  // Genera un array de años entre 2000 y 2025
  const years = Array.from({ length: length }, (_, i) => currentYear - i);

  /**
   * Devuelve el color según la posición
   * @param {number} posicion - Posición del equipo
   * @returns {string} Color asociado
   */
  const getColorPosicion = (posicion) => {
    if (posicion === 1) return "#FFD700";
    if (posicion === 2) return "#C0C0C0";
    if (posicion === 3) return "#CD7F32";
    return "white";
  }

  /**
   * Devuelve el estilo de fuente según la posición
   * @param {number} posicion - Posición del equipo
   * @returns {string} Estilo de fuente
   */
  const getEstiloPosicion = (posicion) => {
    if (posicion <= 3) return "bold";
    return "normal";
  }

  // Muestra animación de carga mientras se obtienen los datos
  if (cargando) { return ( carga() )};
    
  return (
    <div className='container_overflow'>
      <div className='container_fila'>
        <button type='submit' onClick={handlePilotos} className='boton_fondo_15_v3'>Pilotos</button>
        <h2 className='titulo_c4'>Equipos</h2>
      </div> 
      <div className='container_fila'>
        <select className='select' onChange={(e) => setYear(e.target.value)} value={year}>
          {years.map(year => ( <option key={year} value={year}>{year}</option> ))}
        </select>
      </div>
      <div className='container_overflow_padding'>
        <div className='container_grid_v2'>
          {clasificacion.map((equipo, index) => (
            <div key={equipo.constructorId} className='container_grid_v3' style={{ ...(clasificacion.length % 2 !== 0 && index === clasificacion.length - 1 ? { gridColumn: "1 / span 2", justifySelf: "center" } : {}) }}>
              <div className='container_columna_v3'>
                <div className='container_fila_marginLeft'>
                  <span className='span_v8' style={{ color: getColorPosicion(Number(equipo.position)), fontWeight:getEstiloPosicion(Number(equipo.position)) }}>{equipo.position ? equipo.position : "-"}. </span>
                  <span className='span_v2'>{equipo.nombre}</span>
                </div>
                <div className='container_fila_marginLeft_v2'>
                  <img src={getImagenEquipo(equipo.constructorId)} alt="Foto de equipo" className='imagen_equipo'/>
                  <img src={`https://flagcdn.com/w160/${equipo.nacionalidad}.png`} alt={equipo.nacionalidad} className='imagen_equipo_v2'/>
                </div>
                <div className='container_fila'>
                  <span className='span'>{equipo.points} PTS.</span>
                </div>
              </div>
              <img src={getLivery(equipo.constructorId)} alt="Foto de equipo" className='imagen_livery'/>
            </div>
          ))}
        </div>
      </div>
      <br/>
    </div>
  )
}

export default ClasificacionEquipos;