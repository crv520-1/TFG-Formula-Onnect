import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import '../styles/Containers.css';
import { carga } from './animacionCargando.jsx';
import { getImagenCircuito } from './mapeoImagenes.js';

export const Resultados = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { ano } = location.state || {};
  const [circuitos, setCircuitos] = useState([]);
  const [year, setYear] = useState(ano || 2025);
  const [cargando, setCargando] = useState(true);
  let circuitosDatos = [];

  useEffect(() => {
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
        setTimeout(() => { setCargando(false); }, 500);
      } catch (error) {
        console.error("Error en la API", error);
      }
    };
    fetchData();
  }, [year]);

  const handleCircuito = (circuitId, year, round) => {
    // Navegar a la vista de los resultados de un circuito
    navigate(`/ResultadoCircuito`, { state: { circuitId, year, round } });
  }

  // Se crea un array que comprenda los años entre el 2000 y el 2025
  const years = Array.from({ length: 26 }, (_, i) => 2025 - i);

  if (cargando) { return carga() }
  
  return (
    <div className='container_overflow'>
      <div className='container_fila'>
        <h2 className='titulo_c4_v2'>Calendario</h2>
      </div>
      <div className='container_fila'>
        {/* Seleccionable para elegir el año */}
        <select className='select' onChange={(e) => setYear(e.target.value)} value={year}>
          {years.map(year => ( <option key={year} value={year}>{year}</option> ))}
        </select>
      </div>
      <div className='container_overflow_padding'>
        {circuitos.map((circuito) => (
          <button key={circuito.idCircuitos} onClick={() => handleCircuito(circuito.circuitId, year, circuito.ronda)} className='boton_fondo_2c_v10'>
            <div key={circuito.idCircuitos} className='container_fila'>
              <img src={getImagenCircuito(circuito.circuitId)} alt={circuito.circuitId} style={{ width: "45vh", height: "25vh" }} />
              <div className='container_columna_paddingLeft'>
                <h3 className='datos_v7'>{circuito.nombreCircuito}</h3>
                <div className='container_fila'>
                  <img src={`https://flagcdn.com/w160/${circuito.isoPais}.png`} alt={circuito.isoPais} style={{ width: "6vh", height: "4vh" }} />
                  <p className='datos_v6'>{circuito.ciudad}, {circuito.pais}</p>
                </div>
                <p className='datos_v6'>{circuito.fechaInicioFinDeSemana} - {circuito.fechaCarrera}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Resultados;