import React from 'react';
import { useNavigate } from "react-router-dom";

export const Clasificacion = () => {
  const navigate = useNavigate();

  const handleEquipos = (e) => {
    e.preventDefault();
    navigate("/ClasificacionEquipos");
    console.log("Equipos");
  }

  return (
    <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} >
      <h2 style={{ backgroundColor: "#C40000", borderRadius:"0.5vh", width: "15vh", fontSize:"2vh", textAlign: "center" }}>Pilotos</h2>
      <button type='submit' onClick={handleEquipos} style={{ fontSize: "2vh", height:"3vh", marginLeft: "35vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor:"#15151E" }}>Equipos</button>
    </div> 
  )
}

export default Clasificacion;
