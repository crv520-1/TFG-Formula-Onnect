@startuml "Formula Onnect - Casos de Uso"

left to right direction
skinparam packageStyle rectangle

actor "Usuario Registrado" as user


  ' Gestión de cuenta
  usecase "Iniciar sesión" as UC1
  usecase "Registrarse" as UC2
  usecase "Cerrar sesión" as UC3
  usecase "Editar perfil" as UC4
  
  ' Interacción social
  usecase "Ver publicaciones" as UC5
  usecase "Crear publicaciones" as UC6
  usecase "Dar me gusta a publicaciones" as UC7
  usecase "Comentar publicaciones" as UC8
  usecase "Responder a comentarios" as UC9
  usecase "Dar me gusta a comentarios" as UC10
  usecase "Ver perfil de usuarios" as UC11
  usecase "Seguir usuarios" as UC12
  usecase "Dejar de seguir usuarios" as UC13
  usecase "Quitar me gusta publicaciones" as UC25
  usecase "Quitar me gusta comentarios" as UC26
  
  ' Información de Fórmula 1
  usecase "Ver guía de pilotos" as UC14
  usecase "Ver detalles de piloto" as UC15
  usecase "Ver guía de equipos" as UC16
  usecase "Ver detalles de equipo" as UC17
  usecase "Ver guía de circuitos" as UC18
  usecase "Ver detalles de circuito" as UC19
  usecase "Ver clasificación de pilotos" as UC20
  usecase "Ver clasificación de equipos" as UC21
  usecase "Ver resultados de carreras" as UC22
  usecase "Ver detalles de Gran Premio" as UC23
  usecase "Seleccionar año de consulta" as UC24

user -up-> UC26
user -up-> UC1
user -up-> UC2
user -up-> UC3
user -up-> UC4
user -up-> UC5
user -up-> UC6
user -up-> UC7
user -up-> UC8
user -left-> UC9 #line:red;line.bold;
user -left-> UC10 #line:red;line.bold;
user -left-> UC11 #line:red;line.bold;
user -left-> UC12 #line:red;line.bold;
user -right-> UC13 #line:green;line.bold;
user -right-> UC14 #line:green;line.bold;
user -right-> UC15 #line:green;line.bold;
user -right-> UC16 #line:green;line.bold;
user --> UC17
user --> UC18
user --> UC19
user --> UC20
user --> UC21
user --> UC22
user --> UC23
user --> UC24
user --> UC25

@enduml