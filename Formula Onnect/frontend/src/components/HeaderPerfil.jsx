import { ArrowRightEndOnRectangleIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import axios from 'axios';
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import '../styles/Botones.css';
import '../styles/Containers.css';

/**
 * Componente que muestra la cabecera del perfil de usuario
 * Incluye información básica, estadísticas y botones de acción
 * Gestiona la funcionalidad de seguir/dejar de seguir a otros usuarios
 */
const PerfilHeader = ({ usuario, numeroPublicaciones, seguidores, siguiendo, sigo, idUser, mismoUsuario, onSeguidoresChange }) => {
  const navigate = useNavigate();

  /**
   * Función para navegar a la página de editar perfil
   */
  const handleEditarPerfil = () => {
    navigate("/EditarPerfil");
  };

  /**
   * Función para cerrar sesión y volver a la pantalla de login
   */
  const handleCerrarSesion = () => {
    navigate("/IniciarSesion");
  };

  /**
   * Función para seguir o dejar de seguir a un usuario
   * Actualiza la relación en la base de datos y actualiza el contador de seguidores
   */
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
    <div className="container_columna">
      <h1 className="titulo_nombreUsuario"> {usuario.nickName} </h1>
      <div className="container_fila">
        <img src={usuario.fotoPerfil} alt="Foto de perfil" className="imagen_perfil_v2"/>
        <div className="container_columna_paddingLeft_v2">
          <div className="container_fila">
            <p className="datos_informativos">{usuario.nombreCompleto}</p>
            {mismoUsuario ? (
              <div className="container_fila">
                <button type='submit' onClick={handleEditarPerfil} className="boton_fondo_15"><PencilSquareIcon className="icono_v2" /></button>
                <button type='submit' onClick={handleCerrarSesion} className="boton_fondo_15"><ArrowRightEndOnRectangleIcon className="icono_v2" /></button>
              </div>
            ) : null}
          </div>
          <div className="container_fila">
            <div className="container_columna">
              <p className="datos_v13"> Publicaciones </p>
              <p className="datos_v14"> {numeroPublicaciones} </p>
            </div>
            <div className="principal">
              <p className="datos_v13"> Seguidores </p>
              <p className="datos_v14"> {seguidores} </p>
            </div>
            <div className="principal">
              <p className="datos_v13"> Siguiendo </p>
              <p className="datos_v14"> {siguiendo} </p>
            </div>
          </div>
          {!mismoUsuario ? (
            !sigo ? (
              <button type='submit' onClick={handleSeguir} className="boton_seguir"> Seguir </button>
            ) : (
              <button type='submit' onClick={handleSeguir} className="boton_dejar_seguir"> Dejar de seguir </button>
            )
          ) : null}
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