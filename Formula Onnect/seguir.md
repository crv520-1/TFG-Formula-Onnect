@startuml
actor User as UsuarioActual
participant "Frontend\n(PerfilDatos.jsx o PerfilPublicaciones.jsx\n+ HeaderPerfil.jsx)" as FrontendPerfil
participant "Backend API\n(seguidoresController.js)" as BackendSeguidores
database "Base de Datos\n(seguidoresModel.js)" as DB

skinparam sequenceArrowThickness 2
skinparam roundcorner 10
skinparam maxmessagesize 350
skinparam sequenceParticipant 요소자간간격 50

note over UsuarioActual, FrontendPerfil : UsuarioActual está viendo el perfil de OtroUsuario
FrontendPerfil -> BackendSeguidores : GET /api/seguidores/:idUsuarioActual/:idOtroUsuario (al cargar perfil, vía verificarSeguimiento)
activate BackendSeguidores
BackendSeguidores -> DB : SELECT desde Seguidores (idSeguidor = idUsuarioActual, idSeguido = idOtroUsuario)
activate DB
DB --> BackendSeguidores : Resultado (existe o no la relación)
deactivate DB
BackendSeguidores --> FrontendPerfil : Respuesta (true/false si ya sigue)
deactivate BackendSeguidores
FrontendPerfil -> FrontendPerfil : Actualiza estado 'sigo' y UI (muestra "Seguir" o "Dejar de Seguir")

alt UsuarioActual decide Seguir a OtroUsuario (botón "Seguir")
    UsuarioActual -> FrontendPerfil : Pulsa botón "Seguir"
    activate FrontendPerfil
    FrontendPerfil -> BackendSeguidores : POST /api/seguidores (idSeguidor: idUsuarioActual, idSeguido: idOtroUsuario)
    activate BackendSeguidores
    BackendSeguidores -> DB : INSERT en Seguidores (idUsuarioActual, idOtroUsuario)
    activate DB
    DB --> BackendSeguidores : Seguimiento creado
    deactivate DB
    BackendSeguidores --> FrontendPerfil : Respuesta (éxito)
    deactivate BackendSeguidores
    FrontendPerfil -> FrontendPerfil : Llama a onSeguidoresChange(nuevoContadorSeguidores, true)
    FrontendPerfil -> FrontendPerfil : Actualiza estado 'sigo' a true, actualiza contador de seguidores
    FrontendPerfil --> UsuarioActual : UI actualizada (botón "Dejar de Seguir", contador seguidores +1)
    deactivate FrontendPerfil
else UsuarioActual decide Dejar de Seguir a OtroUsuario (botón "Dejar de Seguir")
    UsuarioActual -> FrontendPerfil : Pulsa botón "Dejar de Seguir"
    activate FrontendPerfil
    FrontendPerfil -> BackendSeguidores : DELETE /api/seguidores/:idUsuarioActual/:idOtroUsuario
    activate BackendSeguidores
    BackendSeguidores -> DB : DELETE de Seguidores (idSeguidor = idUsuarioActual, idSeguido = idOtroUsuario)
    activate DB
    DB --> BackendSeguidores : Seguimiento eliminado
    deactivate DB
    BackendSeguidores --> FrontendPerfil : Respuesta (éxito)
    deactivate BackendSeguidores
    FrontendPerfil -> FrontendPerfil : Llama a onSeguidoresChange(nuevoContadorSeguidores, false)
    FrontendPerfil -> FrontendPerfil : Actualiza estado 'sigo' a false, actualiza contador de seguidores
    FrontendPerfil --> UsuarioActual : UI actualizada (botón "Seguir", contador seguidores -1)
    deactivate FrontendPerfil
end

@enduml