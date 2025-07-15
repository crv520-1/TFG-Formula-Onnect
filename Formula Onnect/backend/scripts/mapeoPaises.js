function getPaisISO(nationality) {
    const isoPaises = {
        'Spanish': 'es', 'Spain': 'es',
        'British': 'gb', 'UK': 'gb',
        'German': 'de', 'Germany': 'de',
        'French': 'fr', 'France': 'fr',
        'Italian': 'it', 'Italy': 'it',
        'Dutch': 'nl', 'Netherlands': 'nl',
        'Brazilian': 'br', 'Brazil': 'br',
        'Australian': 'au', 'Australia': 'au',
        'Canadian': 'ca', 'Canada': 'ca',
        'Finnish': 'fi',
        'Argentinian': 'ar', 'Argentine': 'ar', 'Argentina': 'ar',
        'Austrian': 'at', 'Austria': 'at',
        'Czech': 'cz', 'Czech Republic': 'cz',
        'Colombian': 'co', 'Colombia': 'co',
        'Malaysian': 'my', 'Malaysia': 'my',
        'Japanese': 'jp', 'Japan': 'jp',
        'Hungarian': 'hu', 'Hungary': 'hu',
        'Irish': 'ie', 'Republic of Ireland': 'ie',
        'Danish': 'dk', 'Denmark': 'dk',
        'Indian': 'in', 'India': 'in',
        'Portuguese': 'pt', 'Portugal': 'pt',
        'Polish': 'pl', 'Poland': 'pl',
        'American': 'us', 'USA': 'us', 'United States': 'us',
        'Swedish': 'se', 'Sweden': 'se',
        'Belgian': 'be', 'Belgium': 'be',
        'Swiss': 'ch', 'Switzerland': 'ch',
        'South African': 'za', 'South Africa': 'za',
        'Venezuelan': 've', 'Venezuela': 've',
        'New Zealander': 'nz', 'New Zealand': 'nz',
        'Russian': 'ru', 'Russia': 'ru',
        'Mexican': 'mx', 'Mexico': 'mx',
        'Monegasque': 'mc', 'Monaco': 'mc',
        'Thai': 'th', 'Thailand': 'th',
        'Indonesian': 'id', 'Indonesia': 'id',
        'Chinese': 'cn', 'China': 'cn',
        'Bahrain': 'bh',
        'Turkey': 'tr',
        'Singapore': 'sg',
        'Korea': 'kr', 'South Korea': 'kr',
        'UAE': 'ae', 'United Arab Emirates': 'ae',
        'Azerbaijan': 'az',
        'Saudi Arabia': 'sa',
        'Qatar': 'qa'
    };
    return isoPaises[nationality] || 'XX';
}

function getTraduccionPais(nationality) {
    const traduccionPaises = {
        'Spanish': 'España', 'Spain': 'España',
        'British': 'Reino Unido', 'UK': 'Reino Unido',
        'German': 'Alemania', 'Germany': 'Alemania',
        'French': 'Francia', 'France': 'Francia',
        'Italian': 'Italia', 'Italy': 'Italia',
        'Dutch': 'Países Bajos', 'Netherlands': 'Países Bajos',
        'Brazilian': 'Brasil', 'Brazil': 'Brasil',
        'Australian': 'Australia', 'Australia': 'Australia',
        'Canadian': 'Canadá', 'Canada': 'Canadá',
        'Finnish': 'Finlandia',
        'Argentinian': 'Argentina', 'Argentine': 'Argentina', 'Argentina': 'Argentina',
        'Austrian': 'Austria', 'Austria': 'Austria',
        'Czech': 'República Checa', 'Czech Republic': 'República Checa',
        'Colombian': 'Colombia', 'Colombia': 'Colombia',
        'Malaysian': 'Malasia', 'Malaysia': 'Malasia',
        'Japanese': 'Japón', 'Japan': 'Japón',
        'Hungarian': 'Hungría', 'Hungary': 'Hungría',
        'Irish': 'República de Irlanda', 'Republic of Ireland': 'República de Irlanda',
        'Danish': 'Dinamarca', 'Denmark': 'Dinamarca',
        'Indian': 'India', 'India': 'India',
        'Portuguese': 'Portugal', 'Portugal': 'Portugal',
        'Polish': 'Polonia', 'Poland': 'Polonia',
        'American': 'Estados Unidos', 'USA': 'Estados Unidos', 'United States': 'Estados Unidos',
        'Swedish': 'Suecia', 'Sweden': 'Suecia',
        'Belgian': 'Bélgica', 'Belgium': 'Bélgica',
        'Swiss': 'Suiza', 'Switzerland': 'Suiza',
        'South African': 'Sudáfrica', 'South Africa': 'Sudáfrica',
        'Venezuelan': 'Venezuela', 'Venezuela': 'Venezuela',
        'New Zealander': 'Nueva Zelanda', 'New Zealand': 'Nueva Zelanda',
        'Russian': 'Rusia', 'Russia': 'Rusia',
        'Mexican': 'México', 'Mexico': 'México',
        'Monegasque': 'Mónaco', 'Monaco': 'Mónaco',
        'Thai': 'Tailandia', 'Thailand': 'Tailandia',
        'Indonesian': 'Indonesia', 'Indonesia': 'Indonesia',
        'Chinese': 'China', 'China': 'China',
        'Bahrain': 'Bahrein',
        'Turkey': 'Turquía',
        'Singapore': 'Singapur',
        'Korea': 'Corea del Sur', 'South Korea': 'Corea del Sur',
        'UAE': 'Emiratos Árabes Unidos', 'United Arab Emirates': 'Emiratos Árabes Unidos',
        'Azerbaijan': 'Azerbaiyán',
        'Saudi Arabia': 'Arabia Saudita',
        'Qatar': 'Catar'
    };
    return traduccionPaises[nationality] || '';
}

// Se usa para exportar de cara a la aplicación web para usarlo en el frontend de la clasificación de pilotos y de equipos
export { getPaisISO, getTraduccionPais };

// IMPORTANTE. SI NO FUNCIONA LA BASE DE DATOS PROBAR A ACTIVAR ESTO.
// IMPORTANTE. NECESARIO PARA CARGAR EN LA BASE DE DATOS LOS ELEMENTOS INCIALES.
// Se usa para exportar de cara a la API de la base de datos
/*module.exports = {
    getPaisISO,
    getTraduccionPais
};*/


