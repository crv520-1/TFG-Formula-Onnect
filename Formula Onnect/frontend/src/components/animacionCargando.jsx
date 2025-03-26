// Función para la animación de cargar
function carga() {
    return (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "80vh" }}>
            <img style={{ width: "300px", height: "300px", animation: "spin 3s linear infinite"}} src={getImagen()} />
            <style>{`@keyframes spin {0% { transform: rotate(0deg); }100% { transform: rotate(360deg); }}`}</style>
        </div>
    );
}

// Función para obtener una imagen de carga de manera aleatoria
function getImagen() {
    // Escogemos un número aleatorio para seleccionar una imagen de carga de manera aleatoria
    let numeroAleatorio = Math.floor(Math.random() * 5);

    // Dependiendo del número aleatorio, seleccionamos una imagen de carga
    switch (numeroAleatorio) {
        case 0:
            return "images/cargando/Blando.png";
        case 1:
            return "images/cargando/Medio.png";
        case 2:
            return "images/cargando/Duro.png";
        case 3:
            return "images/cargando/Intermedio.png";
        case 4:
            return "images/cargando/Lluvia.png";
        default:
            return "images/cargando/Blando.png";
    }
}

export { carga, getImagen };
