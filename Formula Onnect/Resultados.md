@startuml
actor User as "Usuario"
participant "Frontend\n(Resultados.jsx)" as FrontendResultados
participant "Frontend\n(resultadoCircuito.jsx)" as FrontendResultadoCircuito
participant "Backend API\n(circuitosController.js)" as BackendCircuitos
participant "Servicio Externo\n(API Ergast)" as ErgastAPI
database "Base de Datos\n(circuitosModel.js)" as DB

skinparam sequenceArrowThickness 2
skinparam roundcorner 10
skinparam maxmessagesize 350
skinparam sequenceParticipant 요소자간간격 50

User -> FrontendResultados : Selecciona un circuito del calendario
activate FrontendResultados
FrontendResultados -> FrontendResultados : handleCircuito(circuitId, year, round)
FrontendResultados -> FrontendResultadoCircuito : navigate(`/ResultadoCircuito`, { state: { circuitId, year, round } })
deactivate FrontendResultados

activate FrontendResultadoCircuito
FrontendResultadoCircuito -> FrontendResultadoCircuito : useEffect(() => { loadData() }, [circuitId, year, round])
FrontendResultadoCircuito -> FrontendResultadoCircuito : setCargando(true)

note right of FrontendResultadoCircuito : Realiza múltiples peticiones en paralelo

par Obtener datos del circuito desde la base de datos local
    FrontendResultadoCircuito -> BackendCircuitos : GET /api/circuitos (método fetchCircuito)
    activate BackendCircuitos
    BackendCircuitos -> DB : getAllCircuitos()
    activate DB
    DB --> BackendCircuitos : Lista de todos los circuitos
    deactivate DB
    BackendCircuitos --> FrontendResultadoCircuito : Datos de los circuitos
    deactivate BackendCircuitos
    FrontendResultadoCircuito -> FrontendResultadoCircuito : Filtrar para encontrar el circuito específico
    FrontendResultadoCircuito -> FrontendResultadoCircuito : setCircuitos(circuito)
end

par Obtener resultados de la carrera principal
    FrontendResultadoCircuito -> ErgastAPI : GET https://api.jolpi.ca/ergast/f1/{year}/{round}/results.json
    activate ErgastAPI
    ErgastAPI --> FrontendResultadoCircuito : Datos de resultados de la carrera
    deactivate ErgastAPI
    FrontendResultadoCircuito -> FrontendResultadoCircuito : Procesar resultados (posición, piloto, equipo, estado, puntos)
    FrontendResultadoCircuito -> FrontendResultadoCircuito : setDisputada(!!resultados)
    FrontendResultadoCircuito -> FrontendResultadoCircuito : setPosiciones(resultados)
end

par Obtener horarios del Gran Premio
    FrontendResultadoCircuito -> ErgastAPI : GET https://api.jolpi.ca/ergast/f1/{year}/{round}.json
    activate ErgastAPI
    ErgastAPI --> FrontendResultadoCircuito : Datos del Gran Premio (fechas y horas)
    deactivate ErgastAPI
    FrontendResultadoCircuito -> FrontendResultadoCircuito : Procesar datos (carrera, clasificación, práctica, sprint)
    FrontendResultadoCircuito -> FrontendResultadoCircuito : setHorariosGranPremio(horarios)
    
    alt Si hay sprint en el horario
        FrontendResultadoCircuito -> ErgastAPI : GET https://api.jolpi.ca/ergast/f1/{year}/{round}/sprint.json
        activate ErgastAPI
        ErgastAPI --> FrontendResultadoCircuito : Datos de resultados del sprint
        deactivate ErgastAPI
        FrontendResultadoCircuito -> FrontendResultadoCircuito : setSprintDisputada(!!sprintResults)
        FrontendResultadoCircuito -> FrontendResultadoCircuito : setSprintPosiciones(sprintResults)
    end
end

FrontendResultadoCircuito --> User : Muestra datos del circuito, horarios y resultados

alt Muestra resultados según tipo de carrera y estado
    alt Si no hay sprint
        alt Si la carrera no se ha disputado
            FrontendResultadoCircuito --> User : Muestra mensaje "No se ha disputado aún la carrera"
        else La carrera ya se disputó
            FrontendResultadoCircuito --> User : Muestra tabla con resultados de la carrera
        end
    else Si hay sprint
        alt Si no se ha disputado sprint ni carrera
            FrontendResultadoCircuito --> User : Muestra mensaje "No se ha disputado aún el Gran Premio"
        else Si se disputó el sprint pero no la carrera
            FrontendResultadoCircuito --> User : Muestra resultados del sprint y mensaje sobre la carrera principal
        else Si se disputaron ambos
            FrontendResultadoCircuito --> User : Muestra resultados del sprint y de la carrera principal
        end
    end
end

deactivate FrontendResultadoCircuito

@enduml