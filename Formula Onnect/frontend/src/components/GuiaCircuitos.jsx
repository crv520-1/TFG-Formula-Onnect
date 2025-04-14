import axios from "axios";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Containers.css";
import { carga } from "./animacionCargando.jsx";
import { getImagenCircuito } from './mapeoImagenes.js';

/**
 * Componente que muestra la guía de circuitos de Fórmula 1
 * Presenta todos los circuitos organizados en una cuadrícula
 */
export const GuiaCircuitos = () => {
    const navigate = useNavigate();
    const [circuitos, setCircuitos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        /**
         * Función que carga los datos de los circuitos desde el backend
         */
        const cargarDatos = async () => {
          setCargando(true);
            try {
                const circuitos = await cargarCircuitos();
                if (!circuitos) {
                    console.error("No se encontraron circuitos");
                    return;
                }
                setCircuitos(circuitos);
            } catch (error) {
                console.error("Error en la API", error);
            }
            // Pequeño delay para mostrar la animación de carga
            setTimeout(() => { setCargando(false); }, 500);
        }
        cargarDatos();
    }, []);

    /**
     * Función para obtener los datos de circuitos desde el backend
     * @returns {Array} Lista de circuitos
     */
    const cargarCircuitos = async () => {
      try {
        const circuitosResponse = await axios.get("http://localhost:3000/api/circuitos");
        const data = circuitosResponse.data;
        if (!data) {
          console.error("No se encontraron circuitos");
          return;
        }
        return data;
      } catch (error) {
        console.error("Error en la API", error);
      }
    }

    /**
     * Función para navegar a la sección de pilotos
     */
    const handlePilotos = (e) => {
        e.preventDefault();
        navigate("/GuiaPilotos");
    }

    /**
     * Función para navegar a la sección de equipos
     */
    const handleEquipos = (e) => {
        e.preventDefault();
        navigate("/GuiaEquipos");
    }

    /**
     * Función para ver los detalles de un circuito específico
     * @param {number} idCircuito - ID del circuito a consultar
     */
    const handleCircuito = (idCircuito) => {
        navigate(`/DatosCircuito`, { state: { idCircuito } });
    }

    // Muestra animación de carga mientras se obtienen los datos
    if (cargando) { return carga(); }

  return (
    <div className="container_overflow">
      <div className="container_fila">
        <button type='submit' onClick={handlePilotos} className="boton_fondo_15_v3">Pilotos</button>
        <button type='submit' onClick={handleEquipos} className="boton_fondo_15_v4">Equipos</button>
        <h2 className="titulo_c4_v3">Circuitos</h2>
      </div>
      <div className="container_overflow_padding">
        {circuitos.reduce((rows, circuito, index) => {
          if (index % 3 === 0) rows.push([]);
          rows[rows.length - 1].push(circuito);
          return rows;
        }, []).map((row, rowIndex) => (
          <div key={rowIndex} className="container_fila">
            {row.map((circuito) => (
              <button key={circuito.idCircuitos} onClick={() => handleCircuito(circuito.idCircuitos)} className="boton_fondo_2c_v7">
                <p className="datos_v8">{circuito.nombreCircuito}</p>
                <img src={getImagenCircuito(circuito.circuitId)} alt="Foto del circuito" className="imagen_circuito_v2"/>
                <div className="container_fila_paddingTop">
                    <img src={`https://flagcdn.com/w160/${circuito.isoPais}.png`} alt={circuito.isoPais} className="imagen_bandera_v2"/>
                    <p className="datos_v9">{circuito.ciudad}, {circuito.pais}</p>
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

export default GuiaCircuitos;