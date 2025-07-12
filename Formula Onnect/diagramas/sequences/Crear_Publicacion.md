@startuml
actor User as Usuario
participant "Crear.jsx" as FrontendCrear
participant "Backend API\n(publicacionesController.js)" as BackendPublicaciones
participant "Backend API\n(usuariosController.js)" as BackendUsuarios
database "Base de Datos\n(publicacionesModel.js, usuariosModel.js)" as DB

skinparam sequenceArrowThickness 2
skinparam roundcorner 10
skinparam maxmessagesize 300
skinparam sequenceParticipant 요소자간간격 50

Usuario -> FrontendCrear : Accede a la página de Crear Publicación
activate FrontendCrear
FrontendCrear -> BackendUsuarios : GET /api/usuarios/:idUsuario (para obtener datos del usuario actual)
activate BackendUsuarios
BackendUsuarios -> DB : Consultar datos del usuario (idUsuario)
activate DB
DB --> BackendUsuarios : Datos del usuario
deactivate DB
BackendUsuarios --> FrontendCrear : Datos del usuario (nickName, fotoPerfil)
deactivate BackendUsuarios
FrontendCrear --> Usuario : Muestra formulario (con foto y nick del usuario) y área de texto

Usuario -> FrontendCrear : Escribe el texto de la publicación y pulsa "Publicar"
FrontendCrear -> FrontendCrear : Valida que el texto no esté vacío
alt Validación exitosa
    FrontendCrear -> BackendPublicaciones : POST /api/publicaciones (texto, idUsuario, fechaActual)
    activate BackendPublicaciones
    BackendPublicaciones -> DB : INSERT nueva publicación (texto, idUsuario, fechaActual)
    activate DB
    DB --> BackendPublicaciones : Publicación creada (ID)
    deactivate DB
    BackendPublicaciones --> FrontendCrear : Respuesta (éxito, ID publicación)
    deactivate BackendPublicaciones
    FrontendCrear -> Usuario : Redirige a /PerfilPublicaciones
    deactivate FrontendCrear
else Validación fallida
    FrontendCrear --> Usuario : Muestra mensaje de error (ej: "Tienes que introducir texto")
    deactivate FrontendCrear
end

@enduml