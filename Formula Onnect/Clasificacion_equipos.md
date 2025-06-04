@startuml
actor User as "Usuario"
participant "Frontend\n(ClasificacionEquipos.jsx)" as FrontendClasificacion
participant "API Externa\n(Ergast API)" as ErgastAPI
participant "Backend API\n(equiposController.js)" as BackendEquipos
database "Base de Datos\n(equiposModel.js)" as DB

skinparam sequenceArrowThickness 2
skinparam roundcorner 10
skinparam maxmessagesize 350
skinparam sequenceParticipant 요소자간간격 50

User -> FrontendClasificacion : Accede a Clasificación de Equipos
activate FrontendClasificacion

FrontendClasificacion -> FrontendClasificacion : useEffect(() => { cargarDatos() }, [year])
FrontendClasificacion -> FrontendClasificacion : setCargando(true)

FrontendClasificacion -> FrontendClasificacion : obtenerClasificacion(year)
activate FrontendClasificacion #DDDDDD
FrontendClasificacion -> ErgastAPI : GET https://api.jolpi.ca/ergast/f1/{year}/constructorstandings.json
activate ErgastAPI
ErgastAPI --> FrontendClasificacion : Datos de la clasificación de equipos
deactivate ErgastAPI

loop Para cada equipo en la clasificación
    FrontendClasificacion -> BackendEquipos : GET /api/equipos/constructorId/:constructorId
    activate BackendEquipos
    BackendEquipos -> DB : getEquiposByConstructorId(constructorId)
    activate DB
    DB --> BackendEquipos : Datos del equipo (imágenes, etc.)
    deactivate DB
    BackendEquipos --> FrontendClasificacion : Datos adicionales del equipo
    deactivate BackendEquipos
end

FrontendClasificacion -> FrontendClasificacion : Combinar datos de API externa y datos locales
deactivate FrontendClasificacion #DDDDDD

FrontendClasificacion -> FrontendClasificacion : setClasificacion(equiposConDatos)
FrontendClasificacion -> FrontendClasificacion : setTimeout(() => { setCargando(false) }, 500)

FrontendClasificacion --> User : Muestra tabla de clasificación

alt Usuario cambia el año
    User -> FrontendClasificacion : Selecciona un año diferente en el dropdown
    FrontendClasificacion -> FrontendClasificacion : setYear(nuevoAño)
end

alt Usuario cambia a clasificación de pilotos
    User -> FrontendClasificacion : Hace clic en botón "Pilotos"
    FrontendClasificacion -> FrontendClasificacion : handlePilotos(e)
    FrontendClasificacion -> User : navigate("/Clasificacion")
end

deactivate FrontendClasificacion

@enduml