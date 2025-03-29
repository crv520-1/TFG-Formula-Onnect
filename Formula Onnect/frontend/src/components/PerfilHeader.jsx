import { ArrowRightEndOnRectangleIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";

const PerfilHeader = ({ usuario, numeroPublicaciones, seguidores, siguiendo }) => {
  const navigate = useNavigate();

  const handleEditarPerfil = () => {
    navigate("/EditarPerfil");
  };

  const handleCerrarSesion = () => {
    navigate("/IniciarSesion");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <h1 style={{ fontSize: "4vh", textAlign: "center" }}> {usuario.nickName} </h1>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <img src={usuario.fotoPerfil} alt="Foto de perfil" style={{ width: "15vh", height: "15vh", borderRadius: "50%", color:"white", backgroundColor:"white" }} />
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <p style={{ fontSize: "3vh", marginLeft: "1vh", margin: "1vh" }}>{usuario.nombreCompleto}</p>
                    <button type='submit' onClick={handleEditarPerfil} style={{ fontSize: "2vh", marginLeft: "1vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", height:"3vh", border: "none", backgroundColor:"#15151E" }}><PencilSquareIcon style={{ width: "2vh", height: "2vh" }} /></button>
                    <button type='submit' onClick={handleCerrarSesion} style={{ fontSize: "2vh", marginLeft: "1vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", height:"3vh", border: "none", backgroundColor:"#15151E" }}><ArrowRightEndOnRectangleIcon style={{ width: "2vh", height: "2vh" }} /></button>
                </div>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginLeft: "2vh" }}>
                        <p style={{ fontSize: "1.5vh", margin: "0.3vh 0" }}> Publicaciones </p>
                        <p style={{ fontSize: "1.5vh", margin: "0" }}> {numeroPublicaciones} </p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginLeft: "2vh" }}>
                        <p style={{ fontSize: "1.5vh", margin: "0.3vh 0" }}> Seguidores </p>
                        <p style={{ fontSize: "1.5vh", margin: "0" }}> {seguidores} </p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginLeft: "2vh" }}>
                        <p style={{ fontSize: "1.5vh", margin: "0.3vh 0" }}> Siguiendo </p>
                        <p style={{ fontSize: "1.5vh", margin: "0" }}> {siguiendo} </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
};

// Definición de PropTypes para el componente PerfilHeader
// Esto ayuda a validar los tipos de las props que se pasan al componente.
// En este caso, se espera que el componente reciba un objeto usuario con propiedades específicas
// y números para las propiedades numeroPublicaciones, seguidores y siguiendo.
PerfilHeader.propTypes = {
  usuario: PropTypes.shape({
    nickName: PropTypes.string.isRequired,
    fotoPerfil: PropTypes.string.isRequired,
    nombreCompleto: PropTypes.string.isRequired
  }).isRequired,
  numeroPublicaciones: PropTypes.number.isRequired,
  seguidores: PropTypes.number.isRequired,
  siguiendo: PropTypes.number.isRequired
};

export default PerfilHeader;