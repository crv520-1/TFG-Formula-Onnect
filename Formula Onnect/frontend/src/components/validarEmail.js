const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.(com|es|org|net|edu|gov|mil|io|co|uk|info)$/i;
    return regex.test(email);
};

export { validarEmail };
