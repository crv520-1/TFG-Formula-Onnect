@startuml
actor User as "Usuario"
participant "Frontend\n(GuiaPilotos.jsx)" as FrontendGuia
participant "Backend API\n(pilotosController.js)" as BackendPilotos
database "Base de Datos\n(pilotosModel.js)" as DB

skinparam sequenceArrowThickness 2
skinparam roundcorner 10
skinparam maxmessagesize 350
skinparam sequenceParticipant 요소자간간격 50

User -> FrontendGuia : Navega a la Guía de Pilotos
activate FrontendGuia
FrontendGuia -> FrontendGuia : Inicializa componente (useEffect)

FrontendGuia -> FrontendGuia : Inicia cargarDatos()
FrontendGuia -> BackendPilotos : GET /api/pilotos
activate BackendPilotos
BackendPilotos -> DB : getAllPilotos()
activate DB
DB --> BackendPilotos : Lista de todos los pilotos
deactivate DB
BackendPilotos --> FrontendGuia : Respuesta con array de pilotos
deactivate BackendPilotos

FrontendGuia -> FrontendGuia : setPilotos(data)
FrontendGuia -> FrontendGuia : setTimeout(() => { setCargando(false) }, 500)

FrontendGuia --> User : Muestra cuadrícula de pilotos (4 por fila)
deactivate FrontendGuia

alt Usuario selecciona un piloto
    User -> FrontendGuia : Hace clic en un piloto
    activate FrontendGuia
    FrontendGuia -> FrontendGuia : handlePiloto(idPiloto)
    FrontendGuia -> FrontendGuia : navigate(`/DatosPiloto`, { state: { idPiloto } })
    FrontendGuia --> User : Navega a la vista detallada del piloto
    deactivate FrontendGuia
else Usuario navega a la Guía de Equipos
    User -> FrontendGuia : Hace clic en botón "Equipos"
    activate FrontendGuia
    FrontendGuia -> FrontendGuia : handleEquipos(e)
    FrontendGuia -> FrontendGuia : navigate("/GuiaEquipos")
    FrontendGuia --> User : Navega a la Guía de Equipos
    deactivate FrontendGuia
else Usuario navega a la Guía de Circuitos
    User -> FrontendGuia : Hace clic en botón "Circuitos"
    activate FrontendGuia
    FrontendGuia -> FrontendGuia : handleCircuitos(e)
    FrontendGuia -> FrontendGuia : navigate("/GuiaCircuitos")
    FrontendGuia --> User : Navega a la Guía de Circuitos
    deactivate FrontendGuia
end

@enduml