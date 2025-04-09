import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Containers.css";
import { carga } from './animacionCargando';
import { getImagenCircuito } from './mapeoImagenes.js';

export const DatosCircuito = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { idCircuito } = location.state || {};
  const [circuito, setCircuito] = useState({});
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      try {
        const circuito = await cargarDatosCircuito(idCircuito);
        if (!circuito) {
          console.error("Circuito no encontrado");
          return;
        }
        setCircuito(circuito);
        setTimeout(() => { setCargando(false); }, 500);
      } catch (error) {
        console.error("Error en la API", error);
      }
    };
    cargarDatos();
  }, [idCircuito]);

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

  function getLongitudCarrera(vueltas, longitudCircuito) {
    // Redondeamos a 3 decimales el resultado
    return (vueltas * longitudCircuito).toFixed(3);
  }

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
        <div className='container_file_heightAuto'>
          <p style={{ fontSize: "3vh", textAlign: "center", color: "white", paddingLeft:"1vw" }}>{circuito.nombreCircuito}</p>
        </div>
        <div className='container_columna_marginBottom_v2'>
        <img src={getImagenCircuito(circuito.circuitId)} alt="Foto del equipo" style={{ width: "65vh", height: "35vh", objectFit:"contain" }} />
          <div className='container_fila_marginBottom'>
            <img src={`https://flagcdn.com/w160/${circuito.isoPais}.png`} alt={circuito.isoPais} style={{ width: "6vh", height: "4vh" }} />
            <p style={{ fontSize: "2vh", textAlign: "center", color: "white", paddingLeft:"0.5vw" }}>{circuito.ciudad}</p>
            <p style={{ fontSize: "2vh", textAlign: "center", color: "white", paddingLeft:"0.5vw" }}>,</p>
            <p style={{ fontSize: "2vh", textAlign: "center", color: "white", paddingLeft:"0.5vw" }}>{circuito.pais}</p>
          </div>
        </div>
        <div className='container_columna_marginBottom'>
          <div className='container_columna_blanca'>
            <div className='container_fila_paddingBottom'>
              <div className='container_columna_datos'>
                <p style={{ textAlign: "center" }}>Primera carrera:</p>
                <p style={{ textAlign: "center" }}>{circuito.primeraCarrera}</p>
              </div>
              <div className='container_columna_datos'>
                <p style={{ textAlign: "center" }}>Última carrera:</p>
                <p style={{ textAlign: "center" }}>{circuito.ultimaCarrera}</p>
              </div>
              <div className='container_columna_datos'>
                <p style={{ textAlign: "center" }}>Record de pista:</p>
                <p style={{ textAlign: "center" }}>{circuito.recordPista}</p>
              </div>
            </div>
            <div className='container_fila_paddingBottom'>
              <div className='container_columna_datos'>
                <p style={{ textAlign: "center" }}>Longitud del circuito:</p>
                <div className='container_fila'>
                  <p style={{ textAlign: "center" }}>{circuito.longitudCircuito}</p>
                  <p style={{ textAlign: "center" }}>km</p>
                </div>
              </div>
              <div className='container_columna_datos'>
                <p style={{ textAlign: "center" }}>Número de vueltas:</p>
                <p style={{ textAlign: "center" }}>{circuito.vueltas}</p>
              </div>
                <div className='container_columna_datos'>
                  <p style={{ textAlign: "center" }}>Longitud de carrera:</p>
                  <div className='container_fila'>
                    <p style={{ textAlign: "center" }}>{getLongitudCarrera(circuito.vueltas, circuito.longitudCircuito)}</p>
                    <p style={{ textAlign: "center" }}>km</p>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default DatosCircuito;