// FUnción para validar el email
const validarEmail = (email) => {
    // Fijamos que el email debe tener al menos un caracter antes de la @ [^\s@]+
    // Fijamos que el email debe tener al menos un caracter después de la @ [^\s@]+
    // Fijamos que el email debe tener un punto y una extensión de dominio
    const regex = /^[^\s@]+@[^\s@]+\.(com|es|org|net|edu|gov|mil|io|co|uk|info)$/i;
    return regex.test(email);
};

export { validarEmail };
