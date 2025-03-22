// Método para validar la contraseña
const validarContraseña = (contraseña) => {
    // Fijamos que la contraseña debe tener al menos una minúscula (?=.*[a-z])
    // Fijamos que la contraseña debe tener al menos una mayúscula (?=.*[A-Z])
    // Fijamos que la contraseña debe tener al menos un número (?=.*\d)
    // Fijamos que la contraseña debe tener al menos 8 caracteres {8,}
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(contraseña);
};

export { validarContraseña };
