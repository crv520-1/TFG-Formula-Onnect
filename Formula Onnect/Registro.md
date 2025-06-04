@startuml
actor User as Usuario
participant "Registro1.jsx" as FrontendRegistro1
participant "RegistroNext.jsx" as FrontendRegistroNext
participant "Backend API" as Backend
database "Base de Datos" as DB

skinparam sequenceArrowThickness 2
skinparam roundcorner 10
skinparam maxmessagesize 250
skinparam sequenceParticipant 요소자간간격 50

Usuario -> FrontendRegistro1 : Accede a la página de registro
activate FrontendRegistro1
FrontendRegistro1 -> Backend : GET /api/usuarios (para validaciones)
activate Backend
Backend -> DB : Consultar usuarios existentes
activate DB
DB --> Backend : Lista de usuarios
deactivate DB
Backend --> FrontendRegistro1 : Lista de usuarios
deactivate Backend
FrontendRegistro1 --> Usuario : Muestra formulario (nick, nombre, email, contraseña)
deactivate FrontendRegistro1

Usuario -> FrontendRegistro1 : Rellena datos y pulsa "Continuar"
activate FrontendRegistro1
FrontendRegistro1 -> FrontendRegistro1 : Valida datos (campos, email, contraseña, duplicados)
alt Validación exitosa
    FrontendRegistro1 -> FrontendRegistroNext : Navega a RegistroNext con datos (nick, nombre, email, contraseña)
    deactivate FrontendRegistro1
    activate FrontendRegistroNext
    FrontendRegistroNext -> Backend : GET /api/pilotos
    activate Backend
    Backend -> DB : Consultar pilotos
    activate DB
    DB --> Backend : Lista de pilotos
    deactivate DB
    Backend --> FrontendRegistroNext : Lista de pilotos
    deactivate Backend

    FrontendRegistroNext -> Backend : GET /api/equipos
    activate Backend
    Backend -> DB : Consultar equipos
    activate DB
    DB --> Backend : Lista de equipos
    deactivate DB
    Backend --> FrontendRegistroNext : Lista de equipos
    deactivate Backend

    FrontendRegistroNext -> Backend : GET /api/circuitos
    activate Backend
    Backend -> DB : Consultar circuitos
    activate DB
    DB --> Backend : Lista de circuitos
    deactivate DB
    Backend --> FrontendRegistroNext : Lista de circuitos
    deactivate Backend
    FrontendRegistroNext --> Usuario : Muestra formulario para seleccionar favoritos
    deactivate FrontendRegistroNext

    Usuario -> FrontendRegistroNext : Selecciona favoritos y pulsa "Crear Cuenta"
    activate FrontendRegistroNext
    FrontendRegistroNext -> Backend : POST /api/usuarios (con todos los datos del usuario)
    activate Backend
    Backend -> DB : INSERT nuevo usuario
    activate DB
    DB --> Backend : Usuario creado (ID)
    deactivate DB
    Backend --> FrontendRegistroNext : Respuesta (éxito, ID usuario)
    deactivate Backend
    FrontendRegistroNext -> FrontendRegistroNext : Actualiza UsuarioContext (setUser)
    FrontendRegistroNext -> Usuario : Redirige a /Inicio
    deactivate FrontendRegistroNext
else Validación fallida en Registro1
    FrontendRegistro1 --> Usuario : Muestra mensaje de error
    deactivate FrontendRegistro1
end

@enduml