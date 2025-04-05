import { ArrowRightEndOnRectangleIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import axios from 'axios';
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import '../styles/HeaderPerfil.css';

const PerfilHeader = ({ usuario, numeroPublicaciones, seguidores, siguiendo, sigo, idUser, mismoUsuario, onSeguidoresChange }) => {
  const navigate = useNavigate();

  const handleEditarPerfil = () => {
    navigate("/EditarPerfil");
  };

  const handleCerrarSesion = () => {
    navigate("/IniciarSesion");
  };

  const handleSeguir = async () => {
    if (!sigo) {
      // Seguir al usuario que se está visualizando
      const nuevoSeguimiento = {
        idSeguidor: idUser,
        idSeguido: usuario.idUsuario
      };
      try {
        await axios.post(`http://localhost:3000/api/seguidores/`, nuevoSeguimiento);
        onSeguidoresChange(seguidores + 1, true);
      } catch (error) {
        console.error('Error al seguir:', error);
      }
    } else {
      // Dejar de seguir al usuario que se está visualizando
      try {
        await axios.delete(`http://localhost:3000/api/seguidores/${idUser}/${usuario.idUsuario}`);
        onSeguidoresChange(seguidores - 1, false);
      } catch (error) {
        console.error('Error al dejar de seguir:', error);
      }
    }
  }

  return (
    <div className="perfil-header">
        <h1 className="perfil-header__nickname">{usuario.nickName}</h1>
        <div className="perfil-header__info">
            <img src={usuario.fotoPerfil} alt="Foto de perfil" className="perfil-header__image" />
            <div className="perfil-header__details">
                <div className="perfil-header__name-buttons">
                    <p className="perfil-header__fullname">{usuario.nombreCompleto}</p>
                    {mismoUsuario && (
                        <div className="perfil-header__name-buttons">
                            <button className="perfil-header__button" onClick={handleEditarPerfil}>
                                <PencilSquareIcon className="perfil-header__button-icon" />
                            </button>
                            <button className="perfil-header__button" onClick={handleCerrarSesion}>
                                <ArrowRightEndOnRectangleIcon className="perfil-header__button-icon" />
                            </button>
                        </div>
                    )}
                </div>
                <div className="perfil-header__stats">
                    <div className="perfil-header__stat">
                        <p>Publicaciones</p>
                        <p>{numeroPublicaciones}</p>
                    </div>
                    <div className="perfil-header__stat">
                        <p>Seguidores</p>
                        <p>{seguidores}</p>
                    </div>
                    <div className="perfil-header__stat">
                        <p>Siguiendo</p>
                        <p>{siguiendo}</p>
                    </div>
                </div>
                {!mismoUsuario && (
                    <button
                        className={`perfil-header__follow-button ${
                            sigo ? 'perfil-header__follow-button--dejar-seguir' : 'perfil-header__follow-button--seguir'
                        }`}
                        onClick={handleSeguir}
                    >
                        {sigo ? 'Dejar de seguir' : 'Seguir'}
                    </button>
                )}
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
        idUsuario: PropTypes.number.isRequired,
        nickName: PropTypes.string.isRequired,
        fotoPerfil: PropTypes.string.isRequired,
        nombreCompleto: PropTypes.string.isRequired
    }).isRequired,
    numeroPublicaciones: PropTypes.number.isRequired,
    seguidores: PropTypes.number.isRequired,
    siguiendo: PropTypes.number.isRequired,
    sigo: PropTypes.bool.isRequired,
    idUser: PropTypes.number.isRequired,
    mismoUsuario: PropTypes.bool.isRequired,
    onSeguidoresChange: PropTypes.func.isRequired
};

export default PerfilHeader;