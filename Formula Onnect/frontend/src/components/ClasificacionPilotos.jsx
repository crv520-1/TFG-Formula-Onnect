import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { getPaisISO } from '../../../backend/scripts/mapeoPaises';
import '../styles/Containers.css';
import { carga } from './animacionCargando';
import { getImagenEquipo } from './mapeoImagenes';

/**
 * Componente que muestra la clasificación de pilotos de F1
 * Obtiene datos de una API y permite seleccionar el año
 */
export const Clasificacion = () => {
  const navigate = useNavigate();
  const [year, setYear] = useState(2025);
  const [clasificacion, setClasificacion] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Carga los datos de clasificación al cambiar el año
    const cargarDatos = async () => {
      setCargando(true);
      try {
        const standings = await cargarClasificacionPilotos(year);
        setClasificacion(standings);
        setTimeout(() => { setCargando(false); }, 500); // Simula un pequeño retraso
      } catch (error) {
        console.error("Error en la API", error);
      }
    };
    cargarDatos();
  }, [year]);

  /**
   * Obtiene la clasificación de pilotos desde la API
   * @param {number} year - Año a consultar
   * @returns {Array} Datos de clasificación del mundial
   */
  const cargarClasificacionPilotos = async (year) => {
    try {
      const response = await axios.get(`https://api.jolpi.ca/ergast/f1/${year}/driverstandings.json`);
      const data = response.data.MRData.StandingsTable.StandingsLists[0];
      
      // Paso 1: Crear array de pilotos sin imágenes
      const pilotos = data.DriverStandings.map(piloto => {
        const constructors = piloto.Constructors.map(constructor => ({
          constructorId: constructor.constructorId,
          name: constructor.name
        }));
        
        return {
          position: piloto.position,
          points: piloto.points,
          driverId: piloto.Driver.driverId,
          nombre: piloto.Driver.givenName,
          apellido: piloto.Driver.familyName,
          nacionalidad: getPaisISO(piloto.Driver.nationality),
          numero: piloto.Driver.permanentNumber,
          constructorId: constructors.length > 0 ? constructors[constructors.length - 1].constructorId : '',
          constructorName: constructors.length > 0 ? constructors[constructors.length - 1].name : ''
        };
      });
      
      const imagenes = await Promise.all(
        pilotos.map(piloto => cargarPilotos(piloto.driverId))
      );
      
      return pilotos.map((piloto, index) => ({
        ...piloto,
        imagenPilotos: imagenes[index]
      }));
      
    } catch (error) {
      console.error("Error al obtener la clasificación", error);
      return [];
    }
  };

  const cargarPilotos = async (driverID) => {
    const response = await axios.get(`http://localhost:3000/api/pilotos/driverId/${driverID}`);
    if (!response.data) {
      throw new Error("Piloto no encontrado");
    }
    return response.data.imagenPilotos;
  }

  /**
   * Navega a la página de clasificación de equipos
   */
  const handleEquipos = (e) => {
    e.preventDefault();
    navigate("/ClasificacionEquipos");
    console.log("Equipos");
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
        <h2 className='titulo_c4_v2'>Pilotos</h2>
        <button type='submit' onClick={handleEquipos} className='boton_fondo_15_v2'>Equipos</button>
      </div>
      <div className='container_fila'>
        <select className='select' onChange={(e) => setYear(e.target.value)} value={year}>
          {years.map(year => ( <option key={year} value={year}>{year}</option> ))}
        </select>
      </div>
      <div className='container_overflow_padding'>
        <div className='container_grid_v2'>
          {console.log(clasificacion)}
          {clasificacion.map((piloto, index) => (
            <div key={piloto.driverId} className='container_grid_v4' style={{ ...(clasificacion.length % 2 !== 0 && index === clasificacion.length - 1 ? { gridColumn: "1 / span 2", justifySelf: "center" } : {}) }}>
              <div className='container_columna_v3'>
                <span className='span_v8' style={{ color: getColorPosicion(Number(piloto.position)), fontWeight:getEstiloPosicion(Number(piloto.position)) }}>{piloto.position ? piloto.position : "-"}. </span>
                <span className='span_v3'>{piloto.nombre}</span>
                <span className='span_v3_bold'>{piloto.apellido}</span>
                <span className='span_v4'>{piloto.constructorName}</span>
              </div>
              <img src={piloto.imagenPilotos} alt="Foto de piloto" className='imagen_piloto'/>
              <div className='container_columna_v4'>
                <span className='span_v1'>#{piloto.numero} </span>
                <div className='container_fila'>
                  <img src={getImagenEquipo(piloto.constructorId)} alt="Foto de equipo" className='imagen_equipo'/>
                  <img src={`https://flagcdn.com/w160/${piloto.nacionalidad}.png`} alt={piloto.nacionalidad} className='imagen_equipo_v2'/>
                </div>
                <span className='span'>{piloto.points} PTS.</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <br/>
    </div>
  )
}

export default Clasificacion;
