import axios from "axios";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Containers.css";
import { carga } from './animacionCargando';
import { getImagenPiloto } from './mapeoImagenes.js';

/**
 * Componente que muestra la guía de pilotos de Fórmula 1
 * Presenta todos los pilotos organizados en una cuadrícula
 */
export const GuiaPilotos = () => {
  const navigate = useNavigate();
  const [pilotos, setPilotos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    /**
     * Función que carga los datos de los pilotos desde el backend
     */
    const cargarDatos = async () => {
      setCargando(true);
      try {
        const pilotos = await cargarPilotos();
        if (!pilotos) {
          console.error("No se encontraron pilotos");
          return;
        }
        setPilotos(pilotos);
      } catch (error) {
        console.error("Error en la API", error);
      }
      // Pequeño delay para mostrar la animación de carga
      setTimeout(() => { setCargando(false); }, 500);
    }
    cargarDatos();
  }, []);

  /**
   * Función para obtener los datos de pilotos desde el backend
   * @returns {Array} Lista de pilotos
   */
  const cargarPilotos = async () => {
    setCargando(true);
    try {
      const pilotosResponse = await axios.get("http://localhost:3000/api/pilotos");
      const data = pilotosResponse.data;
      if (!data) {
        console.error("No se encontraron pilotos");
        return;
      }
      return data;
    } catch (error) {
      console.error("Error en la API", error);
    }
  }

  /**
   * Función para navegar a la sección de equipos
   */
  const handleEquipos = (e) => {
    e.preventDefault();
    navigate("/GuiaEquipos");
  }
    
  /**
   * Función para navegar a la sección de circuitos
   */
  const handleCircuitos = (e) => {
    e.preventDefault();
    navigate("/GuiaCircuitos");
  }

  /**
   * Función para ver los detalles de un piloto específico
   * @param {number} idPiloto - ID del piloto a consultar
   */
  const handlePiloto = (idPiloto) => {
    navigate(`/DatosPiloto`, { state: { idPiloto } });
  }

  // Muestra animación de carga mientras se obtienen los datos
  if (cargando) { return carga(); }
        
  return (
    <div className="container_overflow">
      <div className="container_fila">
        <h2 className="titulo_c4_v2">Pilotos</h2>
        <button type='submit' onClick={handleEquipos} className="boton_fondo_15_v4">Equipos</button>
        <button type='submit' onClick={handleCircuitos} className="boton_fondo_15_v4">Circuitos</button>
      </div>
      <div className="container_overflow_padding">
        {pilotos.reduce((rows, piloto, index) => {
          if (index % 4 === 0) rows.push([]);
          rows[rows.length - 1].push(piloto);
          return rows;
        }, []).map((row, rowIndex) => (
          <div key={rowIndex} className="container_fila">
            {row.map((piloto) => (
              <button key={piloto.idPilotos} onClick={() => handlePiloto(piloto.idPilotos)} className="boton_fondo_2c_v9">
                <img src={getImagenPiloto(piloto.driverId)} alt="Foto de piloto" className="imagen_piloto"/>
                <div className="container_fila_v2">
                  <div className="container_columna">
                    <p className="datos_v8">{piloto.nombrePiloto}</p>
                    <p className="datos_v8">{piloto.apellidoPiloto}</p>
                  </div>
                  <img src={`https://flagcdn.com/w160/${piloto.isoNacPil}.png`} alt={piloto.isoNacPil} className="imagen_bandera"/>
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>
      <br/>
    </div>
  )
}

export default GuiaPilotos;