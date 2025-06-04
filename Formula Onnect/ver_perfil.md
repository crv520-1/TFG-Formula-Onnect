@startuml
actor Viewer as "Usuario Visualizador"
participant "Frontend\n(PerfilDatos.jsx)" as FrontendPerfilDatos
participant "Frontend\n(HeaderPerfil.jsx)" as FrontendHeaderPerfil
participant "Backend API\nUsuarios" as BackendUsuarios
participant "Backend API\nPublicaciones" as BackendPublicaciones
participant "Backend API\nSeguidores" as BackendSeguidores
participant "Backend API\nPilotos" as BackendPilotos
participant "Backend API\nEquipos" as BackendEquipos
participant "Backend API\nCircuitos" as BackendCircuitos
database "Base de Datos" as DB

skinparam sequenceArrowThickness 2
skinparam roundcorner 10
skinparam maxmessagesize 400
skinparam sequenceParticipant 요소자간간격 50

Viewer -> FrontendPerfilDatos : Navega al perfil de un usuario (idUser)
activate FrontendPerfilDatos
FrontendPerfilDatos -> FrontendPerfilDatos : Inicia `cargarDatos()` (useEffect)
note right of FrontendPerfilDatos : Paraleliza las siguientes cargas de datos

par Obtener datos del usuario del perfil (idUser)
    FrontendPerfilDatos -> BackendUsuarios : GET /api/usuarios (todos los usuarios)
    activate BackendUsuarios
    BackendUsuarios -> DB : SELECT * FROM Usuario
    activate DB
    DB --> BackendUsuarios : Lista de todos los usuarios
    deactivate DB
    BackendUsuarios --> FrontendPerfilDatos : Lista de usuarios
    deactivate BackendUsuarios
    FrontendPerfilDatos -> FrontendPerfilDatos : Filtra para encontrar el usuario con idUser
    note right of FrontendPerfilDatos : Almacena datos del usuario (nickName, fotoPerfil, nombreCompleto, pilotoFav, equipoFav, circuitoFav)
end

par Obtener datos de favoritos
    FrontendPerfilDatos -> BackendPilotos : GET /api/pilotos
    activate BackendPilotos
    BackendPilotos -> DB : SELECT * FROM Pilotos
    activate DB
    DB --> BackendPilotos : Lista de pilotos
    deactivate DB
    BackendPilotos --> FrontendPerfilDatos : Lista de pilotos
    deactivate BackendPilotos
    FrontendPerfilDatos -> FrontendPerfilDatos : Encuentra pilotoFav y su imagen

    FrontendPerfilDatos -> BackendEquipos : GET /api/equipos
    activate BackendEquipos
    BackendEquipos -> DB : SELECT * FROM Equipos
    activate DB
    DB --> BackendEquipos : Lista de equipos
    deactivate DB
    BackendEquipos --> FrontendPerfilDatos : Lista de equipos
    deactivate BackendEquipos
    FrontendPerfilDatos -> FrontendPerfilDatos : Encuentra equipoFav y su imagen

    FrontendPerfilDatos -> BackendCircuitos : GET /api/circuitos
    activate BackendCircuitos
    BackendCircuitos -> DB : SELECT * FROM Circuitos
    activate DB
    DB --> BackendCircuitos : Lista de circuitos
    deactivate DB
    BackendCircuitos --> FrontendPerfilDatos : Lista de circuitos
    deactivate BackendCircuitos
    FrontendPerfilDatos -> FrontendPerfilDatos : Encuentra circuitoFav y su imagen
end

par Obtener estadísticas del perfil
    FrontendPerfilDatos -> BackendPublicaciones : GET /api/publicaciones/count/:idUser
    activate BackendPublicaciones
    BackendPublicaciones -> DB : SELECT COUNT(*) FROM Publicaciones WHERE usuario = :idUser
    activate DB
    DB --> BackendPublicaciones : Número de publicaciones
    deactivate DB
    BackendPublicaciones --> FrontendPerfilDatos : Número de publicaciones
    deactivate BackendPublicaciones

    FrontendPerfilDatos -> BackendSeguidores : GET /api/seguidores/seguidores/:idUser (Contador de seguidores del perfil)
    activate BackendSeguidores
    BackendSeguidores -> DB : SELECT COUNT(*) FROM Seguidores WHERE idSeguido = :idUser
    activate DB
    DB --> BackendSeguidores : Número de seguidores
    deactivate DB
    BackendSeguidores --> FrontendPerfilDatos : Número de seguidores
    deactivate BackendSeguidores

    FrontendPerfilDatos -> BackendSeguidores : GET /api/seguidores/siguiendo/:idUser (Contador de seguidos por el perfil)
    activate BackendSeguidores
    BackendSeguidores -> DB : SELECT COUNT(*) FROM Seguidores WHERE idSeguidor = :idUser
    activate DB
    DB --> BackendSeguidores : Número de seguidos
    deactivate DB
    BackendSeguidores --> FrontendPerfilDatos : Número de seguidos
    deactivate BackendSeguidores
end

par Verificar relación de seguimiento (UsuarioVisualizador con idUser del perfil)
    FrontendPerfilDatos -> FrontendPerfilDatos : Comprueba si idUser (perfil) === idUsuario (visualizador)
    alt idUser !== idUsuario (no es el mismo usuario)
        FrontendPerfilDatos -> BackendSeguidores : GET /api/seguidores/:idUsuarioVisualizador/:idUserPerfil
        activate BackendSeguidores
        BackendSeguidores -> DB : SELECT * FROM Seguidores WHERE idSeguidor = :idUsuarioVisualizador AND idSeguido = :idUserPerfil
        activate DB
        DB --> BackendSeguidores : Resultado (true/false si sigue)
        deactivate DB
        BackendSeguidores --> FrontendPerfilDatos : Estado de seguimiento ('sigo')
        deactivate BackendSeguidores
    else idUser === idUsuario (es el mismo usuario)
        FrontendPerfilDatos -> FrontendPerfilDatos : Establece 'mismoUsuario' = true, 'sigo' = false
    end
end

FrontendPerfilDatos -> FrontendHeaderPerfil : Pasa datos (usuario, estadísticas, estado 'sigo', 'mismoUsuario')
activate FrontendHeaderPerfil
FrontendHeaderPerfil --> Viewer : Muestra cabecera del perfil (info, estadísticas, botones de Editar/Seguir/Dejar de Seguir)
deactivate FrontendHeaderPerfil
FrontendPerfilDatos --> Viewer : Muestra resto de datos del perfil (favoritos)
deactivate FrontendPerfilDatos

@enduml