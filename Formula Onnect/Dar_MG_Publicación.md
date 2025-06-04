@startuml
actor User as Usuario
participant "Frontend\n(Inicio.jsx / PerfilPublicaciones.jsx\n+ useMeGusta.js)" as Frontend
participant "Backend API\n(meGustaController.js)" as BackendMeGusta
database "Base de Datos\n(meGustaModel.js)" as DB

skinparam sequenceArrowThickness 2
skinparam roundcorner 10
skinparam maxmessagesize 350
skinparam sequenceParticipant 요소자간간격 50

Usuario -> Frontend : Pulsa el botón "Me Gusta" en una publicación
activate Frontend

Frontend -> BackendMeGusta : GET /api/meGusta (para verificar si ya existe el "Me Gusta")
activate BackendMeGusta
BackendMeGusta -> DB : SELECT desde MeGusta (idUser, idElemento)
activate DB
DB --> BackendMeGusta : Resultado de la consulta (existe o no)
deactivate DB
BackendMeGusta --> Frontend : Respuesta (true/false si ya dio "Me Gusta")
deactivate BackendMeGusta

alt El usuario NO ha dado "Me Gusta" previamente
    Frontend -> BackendMeGusta : POST /api/meGusta (idUser, idElemento)
    activate BackendMeGusta
    BackendMeGusta -> DB : INSERT en MeGusta (idUser, idElemento)
    activate DB
    DB --> BackendMeGusta : "Me Gusta" creado (ID)
    deactivate DB
    BackendMeGusta --> Frontend : Respuesta (éxito)
    deactivate BackendMeGusta
    Frontend -> Frontend : Actualiza estado local (userLikes, contador de "Me Gusta")
    Frontend --> Usuario : Muestra "Me Gusta" (icono lleno, contador actualizado)
else El usuario YA ha dado "Me Gusta" previamente
    Frontend -> BackendMeGusta : DELETE /api/meGusta/:idUser/:idElemento
    activate BackendMeGusta
    BackendMeGusta -> DB : DELETE de MeGusta (idUser, idElemento)
    activate DB
    DB --> BackendMeGusta : "Me Gusta" eliminado
    deactivate DB
    BackendMeGusta --> Frontend : Respuesta (éxito)
    deactivate BackendMeGusta
    Frontend -> Frontend : Actualiza estado local (userLikes, contador de "Me Gusta")
    Frontend --> Usuario : Quita "Me Gusta" (icono vacío, contador actualizado)
end

deactivate Frontend
@enduml