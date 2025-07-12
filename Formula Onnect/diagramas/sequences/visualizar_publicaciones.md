@startuml
actor User as Usuario
participant "Frontend\n(Inicio.jsx + usePublicaciones.js)" as FrontendInicio
participant "Backend API\n(publicacionesController.js)" as BackendPub
participant "Backend API\n(meGustaController.js)" as BackendMG
participant "Backend API\n(comentariosController.js)" as BackendCom
database "Base de Datos" as DB

skinparam sequenceArrowThickness 2
skinparam roundcorner 10
skinparam maxmessagesize 350
skinparam sequenceParticipant 요소자간간격 50

Usuario -> FrontendInicio : Accede a la página de Inicio
activate FrontendInicio
FrontendInicio -> FrontendInicio : Dispara `cargarPublicaciones()` desde `usePublicaciones`

FrontendInicio -> BackendPub : GET /api/publicaciones
activate BackendPub
BackendPub -> DB : Publicacion.findAll (include Usuario)
activate DB
DB --> BackendPub : Lista de publicaciones con datos del autor (nickName, fotoPerfil)
deactivate DB
BackendPub --> FrontendInicio : Lista de publicaciones base
deactivate BackendPub

note right of FrontendInicio : Para cada publicación, obtiene detalles adicionales en paralelo (Promise.all)

loop Para cada Publicación en la lista recibida
    group Obtener detalles adicionales para la publicación
        FrontendInicio -> BackendMG : GET /api/meGusta/:idPublicacion (para contador de Me Gusta)
        activate BackendMG
        BackendMG -> DB : SELECT COUNT(*) FROM MeGusta WHERE idElemento = :idPublicacion
        activate DB
        DB --> BackendMG : Número de "Me Gusta"
        deactivate DB
        BackendMG --> FrontendInicio : Número de "Me Gusta"
        deactivate BackendMG

        FrontendInicio -> BackendCom : GET /api/comentarios/numero/:idPublicacion (para contador de Comentarios)
        activate BackendCom
        BackendCom -> DB : SELECT COUNT(*) FROM Comentarios WHERE post = :idPublicacion
        activate DB
        DB --> BackendCom : Número de Comentarios
        deactivate DB
        BackendCom --> FrontendInicio : Número de Comentarios
        deactivate BackendCom

        FrontendInicio -> BackendMG : GET /api/meGusta/:idUsuarioActual/:idPublicacion (para saber si el usuario actual dio "Me Gusta")
        activate BackendMG
        BackendMG -> DB : SELECT desde MeGusta WHERE idUser = :idUsuarioActual AND idElemento = :idPublicacion
        activate DB
        DB --> BackendMG : Resultado (existe o no el "Me Gusta")
        deactivate DB
        BackendMG --> FrontendInicio : Estado de "Me Gusta" del usuario (true/false)
        deactivate BackendMG
    end
end

FrontendInicio -> FrontendInicio : Combina datos base con detalles adicionales para cada publicación
FrontendInicio --> Usuario : Muestra la lista de publicaciones completas (con autor, texto, contadores, estado de "Me Gusta")
deactivate FrontendInicio

@enduml