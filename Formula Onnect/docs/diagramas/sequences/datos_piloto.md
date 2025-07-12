@startuml
actor User as "Usuario"
participant "Frontend\n(GuiaPilotos.jsx)" as FrontendGuiaPilotos
participant "Frontend\n(DatosPiloto.jsx)" as FrontendDatosPiloto
participant "Backend API\n(pilotosController.js)" as BackendPilotos
participant "Backend API\n(scrapingPilotos.js)" as BackendScraping
participant "Servicio Externo\n(Wikipedia)" as Wikipedia
database "Base de Datos\n(pilotosModel.js)" as DB

skinparam sequenceArrowThickness 2
skinparam roundcorner 10
skinparam maxmessagesize 350
skinparam sequenceParticipant 요소자간간격 50

User -> FrontendGuiaPilotos : Hace clic en un piloto
activate FrontendGuiaPilotos
FrontendGuiaPilotos -> FrontendGuiaPilotos : handlePiloto(idPiloto)
FrontendGuiaPilotos -> FrontendDatosPiloto : navigate(`/DatosPiloto`, { state: { idPiloto } })
deactivate FrontendGuiaPilotos
activate FrontendDatosPiloto

FrontendDatosPiloto -> FrontendDatosPiloto : useEffect(() => { cargarDatos() }, [idPiloto])
FrontendDatosPiloto -> FrontendDatosPiloto : setCargando(true)

note right of FrontendDatosPiloto : Carga los datos básicos del piloto

FrontendDatosPiloto -> BackendPilotos : GET /api/pilotos/:idPiloto
activate BackendPilotos
BackendPilotos -> DB : getPilotosByIdPiloto(idPiloto)
activate DB
DB --> BackendPilotos : Datos del piloto (nombre, apellido, nacionalidad, url, etc.)
deactivate DB
BackendPilotos --> FrontendDatosPiloto : Respuesta con datos del piloto
deactivate BackendPilotos

FrontendDatosPiloto -> FrontendDatosPiloto : setPilotos(piloto)

note right of FrontendDatosPiloto : Obtiene datos adicionales mediante scraping

FrontendDatosPiloto -> BackendScraping : GET /api/scrapingPilotos/driver-data?url=piloto.urlPiloto
activate BackendScraping
BackendScraping -> Wikipedia : puppeteer.launch(), page.goto(url)
activate Wikipedia
Wikipedia --> BackendScraping : HTML de la página del piloto
deactivate Wikipedia
BackendScraping -> BackendScraping : Extrae datos (fecha nacimiento/muerte, \nprimera carrera, victorias, podios, etc.)
BackendScraping --> FrontendDatosPiloto : Datos detallados del piloto
deactivate BackendScraping

FrontendDatosPiloto -> FrontendDatosPiloto : setDriverData(scraperResponse)

FrontendDatosPiloto --> User : Muestra datos completos del piloto (información personal, estadísticas y logros)
deactivate FrontendDatosPiloto

@enduml