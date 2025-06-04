@startuml
actor User as "Usuario"
participant "Frontend\n(Resultados.jsx)" as FrontendResultados
participant "Backend API\n(circuitosController.js)" as BackendCircuitos
participant "Servicio Externo\n(API Ergast)" as ErgastAPI
database "Base de Datos\n(circuitosModel.js)" as DB

skinparam sequenceArrowThickness 2
skinparam roundcorner 10
skinparam maxmessagesize 350
skinparam sequenceParticipant 요소자간간격 50

User -> FrontendResultados : Accede a la vista de Resultados
activate FrontendResultados

FrontendResultados -> FrontendResultados : useEffect(() => { fetchData() }, [year])
FrontendResultados -> FrontendResultados : setCargando(true)

par Obtener circuitos desde DB local
    FrontendResultados -> BackendCircuitos : GET /api/circuitos
    activate BackendCircuitos
    BackendCircuitos -> DB : getAllCircuitos()
    activate DB
    DB --> BackendCircuitos : Lista de todos los circuitos
    deactivate DB
    BackendCircuitos --> FrontendResultados : Datos de los circuitos (con detalles completos)
    deactivate BackendCircuitos
end

par Obtener datos del calendario desde API Ergast
    FrontendResultados -> ErgastAPI : GET https://api.jolpi.ca/ergast/f1/{year}.json
    activate ErgastAPI
    ErgastAPI --> FrontendResultados : Datos del calendario (fechas, rondas y circuitId)
    deactivate ErgastAPI
end

FrontendResultados -> FrontendResultados : Combinar datos de DB con API Ergast
FrontendResultados -> FrontendResultados : Filtrar circuitos por año seleccionado
FrontendResultados -> FrontendResultados : Ordenar circuitos por número de ronda
FrontendResultados -> FrontendResultados : Formatear fechas (inicio y fin de GP)
FrontendResultados -> FrontendResultados : setCircuitos(datosOrdenados)

FrontendResultados --> User : Muestra calendario de circuitos del año seleccionado

alt Usuario cambia el año del calendario
    User -> FrontendResultados : Hace clic en botones de navegación de año
    FrontendResultados -> FrontendResultados : setYear(nuevoAño)
end

alt Usuario selecciona un circuito para ver resultados
    User -> FrontendResultados : Hace clic en un circuito
    FrontendResultados -> FrontendResultados : handleCircuito(circuitId, year, round)
    FrontendResultados --> User : navigate(`/ResultadoCircuito`, { state: { circuitId, year, round } })
end

deactivate FrontendResultados
@enduml