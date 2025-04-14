import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import '../styles/Containers.css';
import { carga } from './animacionCargando.jsx';
import { getImagenCircuito } from './mapeoImagenes.js';

/**
 * Componente que muestra el calendario de carreras de una temporada específica
 * Permite seleccionar el año y ver todos los circuitos de esa temporada
 */
export const Resultados = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Obtiene el año desde el estado de navegación
  const { ano } = location.state || {};
  const [circuitos, setCircuitos] = useState([]);
  const [year, setYear] = useState(ano || 2025);
  const [cargando, setCargando] = useState(true);
  let circuitosDatos = [];

  useEffect(() => {
    /**
     * Función que carga los datos del calendario para el año seleccionado
     * Combina información de la API Ergast con datos locales de circuitos
     */
    const fetchData = async () => {
      setCargando(true);
      try {
        const circuitosAnoResponse = await axios.get(`https://api.jolpi.ca/ergast/f1/${year}/races.json`)
        const circuitosAno = circuitosAnoResponse.data.MRData.RaceTable.Races;
        circuitosAno.forEach(circuitoAno => {
            const fechaInicioFinDeSemana = circuitoAno.FirstPractice 
            ? new Date(circuitoAno.FirstPractice.date).toLocaleDateString('es-ES')
            : new Date(circuitoAno.date).toLocaleDateString('es-ES');
            circuitosDatos.push({
              circuitId: circuitoAno.Circuit.circuitId,
              fechaCarrera: new Date(circuitoAno.date).toLocaleDateString('es-ES'),
              fechaInicioFinDeSemana: fechaInicioFinDeSemana,
              ronda: circuitoAno.round
            });
        });
        
        // Obtener información detallada de circuitos desde la base de datos local
        const circuitosResponse = await axios.get(`http://localhost:3000/api/circuitos`);
        // Comprobar si el circuito obtenido está en la temporada actual
        const uniqueCircuitos = {};
        circuitosResponse.data.forEach(circuito => {
          circuitosDatos.forEach(circuitoAno => {
            if (circuito.circuitId === circuitoAno.circuitId) {
              uniqueCircuitos[circuito.circuitId] = {
                ...circuito,
                fechaCarrera: circuitoAno.fechaCarrera,
                fechaInicioFinDeSemana: circuitoAno.fechaInicioFinDeSemana,
                ronda: circuitoAno.ronda
              };
            }
          });
        });
        // Ordenamos los circuitos por ronda, para tener el calendario en orden
        const sortedCircuitos = Object.values(uniqueCircuitos).sort((a, b) => a.ronda - b.ronda);
        setCircuitos(Object.values(sortedCircuitos));
        
        // Pequeño delay para mostrar la animación de carga
        setTimeout(() => { setCargando(false); }, 500);
      } catch (error) {
        console.error("Error en la API", error);
      }
    };
    fetchData();
  }, [year]);

  /**
   * Función para navegar a la vista de resultados de un circuito específico
   * @param {string} circuitId - ID del circuito a consultar
   * @param {number} year - Año de la temporada
   * @param {number} round - Número de carrera en la temporada
   */
  const handleCircuito = (circuitId, year, round) => {
    navigate(`/ResultadoCircuito`, { state: { circuitId, year, round } });
  }

  // Obtiene el año actual
  const currentYear = new Date().getFullYear();

  // Calcula la longitud del array de años
  const length = (currentYear - 2000) + 1;

  // Genera un array de años entre 2000 y 2025
  const years = Array.from({ length: length }, (_, i) => currentYear - i);

  // Muestra animación de carga mientras se obtienen los datos
  if (cargando) { return carga() }
  
  return (
    <div className='container_overflow'>
      <div className='container_fila'>
        <h2 className='titulo_c4_v2'>Calendario</h2>
      </div>
      <div className='container_fila'>
        <select className='select' onChange={(e) => setYear(e.target.value)} value={year}>
          {years.map(year => ( <option key={year} value={year}>{year}</option> ))}
        </select>
      </div>
      <div className='container_overflow_padding'>
        {circuitos.map((circuito) => (
          <button key={circuito.idCircuitos} onClick={() => handleCircuito(circuito.circuitId, year, circuito.ronda)} className='boton_fondo_2c_v10'>
            <div key={circuito.idCircuitos} className='container_fila'>
              <img src={getImagenCircuito(circuito.circuitId)} alt={circuito.circuitId} className='imagen_circuito_v4'/>
              <div className='container_columna_paddingLeft'>
                <h3 className='datos_v7'>{circuito.nombreCircuito}</h3>
                <div className='container_fila'>
                  <img src={`https://flagcdn.com/w160/${circuito.isoPais}.png`} alt={circuito.isoPais} className='imagen_bandera'/>
                  <p className='datos_v6'>{circuito.ciudad}, {circuito.pais}</p>
                </div>
                <p className='datos_v6'>{circuito.fechaInicioFinDeSemana} - {circuito.fechaCarrera}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      <br/>
    </div>
  )
}

export default Resultados;