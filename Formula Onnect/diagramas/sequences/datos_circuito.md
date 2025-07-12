@startuml
actor User as "Usuario"
participant "Frontend\n(GuiaCircuitos.jsx)" as FrontendGuiaCircuitos
participant "Frontend\n(DatosCircuito.jsx)" as FrontendDatosCircuito
participant "Backend API\n(circuitosController.js)" as BackendCircuitos
database "Base de Datos\n(circuitosModel.js)" as DB

skinparam sequenceArrowThickness 2
skinparam roundcorner 10
skinparam maxmessagesize 350
skinparam sequenceParticipant 요소자간간격 50

User -> FrontendGuiaCircuitos : Hace clic en un circuito
activate FrontendGuiaCircuitos
FrontendGuiaCircuitos -> FrontendGuiaCircuitos : handleCircuito(idCircuito)
FrontendGuiaCircuitos -> FrontendDatosCircuito : navigate(`/DatosCircuito`, { state: { idCircuito } })
deactivate FrontendGuiaCircuitos
activate FrontendDatosCircuito

FrontendDatosCircuito -> FrontendDatosCircuito : useEffect(() => { cargarDatos() }, [idCircuito])
FrontendDatosCircuito -> FrontendDatosCircuito : setCargando(true)

FrontendDatosCircuito -> BackendCircuitos : GET /api/circuitos/:idCircuito
activate BackendCircuitos
BackendCircuitos -> DB : getCircuitosByIdCircuito(idCircuito)
activate DB
DB --> BackendCircuitos : Datos del circuito (nombre, localización, características)
deactivate DB
BackendCircuitos --> FrontendDatosCircuito : Respuesta con datos del circuito
deactivate BackendCircuitos

FrontendDatosCircuito -> FrontendDatosCircuito : setCircuito(circuito)
FrontendDatosCircuito -> FrontendDatosCircuito : setTimeout(() => { setCargando(false) }, 500)

alt Mostrar animación durante la carga
    FrontendDatosCircuito -> FrontendDatosCircuito : carga()
end

FrontendDatosCircuito -> FrontendDatosCircuito : getLongitudCarrera(circuito.vueltas, circuito.longitudCircuito)

FrontendDatosCircuito --> User : Muestra datos completos del circuito
deactivate FrontendDatosCircuito

@enduml