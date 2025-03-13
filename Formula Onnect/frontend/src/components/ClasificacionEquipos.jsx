import React from 'react';
import { useNavigate } from "react-router-dom";

export const ClasificacionEquipos = () => {
    const navigate = useNavigate();

    const handlePilotos = (e) => {
        e.preventDefault();
        navigate("/Clasificacion");
        console.log("Pilotos");
      }
    
      return (
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} >
          <button type='submit' onClick={handlePilotos} style={{ fontSize: "2vh", height:"3vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor:"#15151E" }}>Pilotos</button>
          <h2 style={{ backgroundColor: "#C40000", borderRadius:"0.5vh", width: "15vh", fontSize:"2vh", textAlign: "center", marginLeft: "35vh" }}>Equipos</h2>
        </div> 
      )
}

export default ClasificacionEquipos