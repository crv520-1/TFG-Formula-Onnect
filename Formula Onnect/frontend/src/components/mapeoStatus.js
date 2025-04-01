// Mapeo de los estados de los resultados de los pilotos traducido al español
export function getStatusTraducido(status) {
    switch (status) {
        case "Finished":
            return "Finalizado";
        case "Lapped":
            return "Doblado";
        case "Retired":
            return "Retirado";
        case "Disqualified":
            return "Descalificado";
        case "Not Classified":
            return "No clasificado";
        case "Accident":
            return "Accidente";
        case "Engine":
            return "Motor";
        case "Transmission":
            return "Transmisión";
        case "Clutch":
            return "Embrague";
        case "Suspension":
            return "Suspensión";
        case "Did not start":
            return "No comenzó";
        case "+1 Lap":
            return "+1 vuelta";
        case "+2 Laps":
            return "+2 vueltas";
        case "+3 Laps":
            return "+3 vueltas";
        case "+4 Laps":
            return "+4 vueltas";
        case "+5 Laps":
            return "+5 vueltas";
        case "+6 Laps":
            return "+6 vueltas";
        case "Spun off":
            return "Salida de pista";
        case "Hydraulics":
            return "Hidráulica";
        case "Oil pressure":
            return "Presión de aceite";
        case "Gearbox":
            return "Caja de cambios";
        case "Safety concerns":
            return "Preo. seguridad";
        case "Fuel system":
            return "Sis. combustible";
        case "Electrical":
            return "Eléctrico";
        case "Collision":
            return "Colisión";
        case "Throttle":
            return "Acelerador";
        case "Halfshaft":
            return "Semieje";
        case "Not started" :
            return "No comenzó";
        case "Brakes":
            return "Frenos";
        case "Oil leak":
            return "Fuga de aceite";
        case "Alternator":
            return "Alternador";
        case "Fuel pressure":
            return "Pres. combustible";
        case "Wheel":
            return "Rueda";
        case "Drivedrew":
            return "Conductor";
        case "Power Unit":
            return "Unidad de potencia";
        case "Exhaust":
            return "Escape";
        case "Radiator":
            return "Radiador";
        case "Water leak":
            return "Fuga de agua";
        case "Wheel rim":
            return "Llanta";
        case "Brake duct":
            return "Conducto de freno";
        case "Seat":
            return "Asiento";
        case "Track rod":
            return "Varilla de pista";
        case "Wheel bearing":
            return "Cojinete de rueda";
        case "Damage":
            return "Daño";
        case "Puncture":
            return "Pinchazo";
        case "Injury":
            return "Lesión";
        case "Overheating":
            return "Sobrecalentamiento";
        case "Electronics":
            return "Electrónica";
        case "Withdrew":
            return "Se retiró";
        case "Ignition":
            return "Ignición";
        case "Out of fuel":
            return "Sin combustible";
        default:
            return status;
    }
}