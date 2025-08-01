// Función para obtener la imagen de un piloto
export function getImagenPiloto(driverId) {
    // Mapa de las imágenes de los pilotos
    const imagenPiloto = {
        "alesi" : "images/pilotos/Jean Alesi.png",
        "barrichello" : "images/pilotos/Rubens Barrichello.png",
        "burti" : "images/pilotos/Luciano Burti.png",
        "button" : "images/pilotos/Jenson Button.png",
        "coulthard" : "images/pilotos/David Coulthard.png",
        "rosa" : "images/pilotos/Pedro de la Rosa.png",
        "diniz" : "images/pilotos/Pedro Diniz.png",
        "fisichella" : "images/pilotos/Giancarlo Fisichella.png",
        "frentzen" : "images/pilotos/Heinz-Harald.png",
        "gene" : "images/pilotos/Marc Gené.png",
        "hakkinen" : "images/pilotos/Mika Hakkinen.png",
        "heidfeld" : "images/pilotos/Nick Heidfeld.png",
        "herbert" : "images/pilotos/Johnny Herbert.png",
        "irvine" : "images/pilotos/Eddie Irvine.png",
        "mazzacane" : "images/pilotos/Gastón Mazzacane.png",
        "salo" : "images/pilotos/Mika Salo.png",
        "michael_schumacher" : "images/pilotos/Michael Schumacher.png",
        "ralf_schumacher" : "images/pilotos/Ralf Schumacher.png",
        "trulli" : "images/pilotos/Jarno Trulli.png",
        "verstappen" : "images/pilotos/Jos Verstappen.png",
        "villeneuve" : "images/pilotos/Jacques Villeneuve.png",
        "wurz" : "images/pilotos/Alexander Wurz.png",
        "zonta" : "images/pilotos/Ricardo Zonta.png",
        "alonso" : "images/pilotos/FernandoAlonso.png",
        "bernoldi" : "images/pilotos/Enrique Bernoldi.png",
        "enge" : "images/pilotos/Tomas Enge.png",
        "marques" : "images/pilotos/Tarso Marques.png",
        "montoya" : "images/pilotos/Juan Pablo Montoya.png",
        "panis" : "images/pilotos/Olivier Panis.png",
        "raikkonen" : "images/pilotos/Kimi Raikkonen.png",
        "yoong" : "images/pilotos/Alex Yoong.png",
        "davidson" : "images/pilotos/Anthony Davidson.png",
        "massa" : "images/pilotos/Felipe Massa.png",
        "mcnish" : "images/pilotos/Allan McNish.png",
        "sato" : "images/pilotos/Takuma Sato.png",
        "webber" : "images/pilotos/Mark Webber.png",
        "baumgartner" : "images/pilotos/Zlost Baumgartner.png",
        "matta" : "images/pilotos/Cristiano da Matta.png",
        "firman" : "images/pilotos/Ralph Firman.png",
        "kiesa" : "images/pilotos/Nicolas Kiesa.png",
        "pizzonia" : "images/pilotos/Antonio Pizzonia.png",
        "wilson" : "images/pilotos/Justin Wilson.png",
        "bruni" : "images/pilotos/Gianmaria Bruni.png",
        "glock" : "images/pilotos/Timo Glock.png",
        "klien" : "images/pilotos/Christian Klien.png",
        "pantano" : "images/pilotos/Giorgio Pantano.png",
        "albers" : "images/pilotos/Christijan Albers.png",
        "doornbos" : "images/pilotos/Robert Doornbos.png",
        "friesacher" : "images/pilotos/Patrick Friesacher.png",
        "karthikeyan" : "images/pilotos/narain karthikeyan.png",
        "liuzzi" : "images/pilotos/Vitantonio Liuzzi.png",
        "monteiro" : "images/pilotos/Tiago Monteiro.png",
        "ide" : "images/pilotos/Yuji Ide.png",
        "kubica" : "images/pilotos/Robert Kubica.png",
        "montagny" : "images/pilotos/Franck Montagny.png",
        "rosberg" : "images/pilotos/Nico Rosberg.png",
        "speed" : "images/pilotos/Scott Speed.png",
        "yamamoto" : "images/pilotos/Sakon Yamamoto.png",
        "hamilton" : "images/pilotos/LewisHamilton.png",
        "kovalainen" : "images/pilotos/Hekki Kovalainen.png",
        "nakajima" : "images/pilotos/Kazuki Nakajima.png",
        "sutil" : "images/pilotos/Adrian Sutil.png",
        "vettel" : "images/pilotos/Sebastian Vettel.png",
        "markus_winkelhock" : "images/pilotos/markus winkelhock.png",
        "bourdais" : "images/pilotos/Sebastien Bourdais.png",
        "piquet_jr" : "images/pilotos/Nelson Piquet Jr.png",
        "alguersuari" : "images/pilotos/Jaime Alguersuari.png",
        "badoer" : "images/pilotos/Luca Badoer.png",
        "buemi" : "images/pilotos/Sebastien Buemi.png",
        "grosjean" : "images/pilotos/Romain Grosjean.png",
        "kobayashi" : "images/pilotos/Kamui Kobayashi.png",
        "chandhok" : "images/pilotos/karun chandhok.png",
        "grassi" : "images/pilotos/Lucas di Grassi.png",
        "hulkenberg" : "images/pilotos/Nico Hulkenberg.png",
        "petrov" : "images/pilotos/Vitaly Petrov.png",
        "bruno_senna" : "images/pilotos/Bruno Senna.png",
        "ambrosio" : "images/pilotos/jérôme d'ambrosio.png",
        "resta" : "images/pilotos/Paul di Resta.png",
        "maldonado" : "images/pilotos/Pastor Maldonado.png",
        "perez" : "images/pilotos/Sergio Perez.png",
        "ricciardo" : "images/pilotos/Daniel Ricciardo.png",
        "pic" : "images/pilotos/Charles Pic.png",
        "vergne" : "images/pilotos/Jean-Eric Vergne.png",
        "jules_bianchi" : "images/pilotos/Jules Bianchi.png",
        "bottas" : "images/pilotos/Valtteri Bottas.png",
        "chilton" : "images/pilotos/Max Chilton.png",
        "gutierrez" : "images/pilotos/Esteban Gutierrez.png",
        "garde" : "images/pilotos/Giedo Van der Garde.png",
        "ericsson" : "images/pilotos/Marcus Ericsson.png",
        "kvyat" : "images/pilotos/Daniil Kvyat.png",
        "lotterer" : "images/pilotos/André Lotterer.png",
        "kevin_magnussen" : "images/pilotos/Kevin Magnussen.png",
        "stevens" : "images/pilotos/Will Stevens.png",
        "merhi" : "images/pilotos/Roberto Merhi.png",
        "nasr" : "images/pilotos/Felipe Nasr.png",
        "rossi" : "images/pilotos/Alexander Rossi.png",
        "sainz" : "images/pilotos/Carlos Sainz Jr.png",
        "max_verstappen" : "images/pilotos/MaxVerstappen.png",
        "haryanto" : "images/pilotos/Rio Haryanto.png",
        "ocon" : "images/pilotos/Esteban Ocon.png",
        "jolyon_palmer" : "images/pilotos/Jolyon Palmer.png",
        "vandoorne" : "images/pilotos/Stoffel Vandoorne.png",
        "wehrlein" : "images/pilotos/Pascal Wehrlein.png",
        "gasly" : "images/pilotos/Pierre Gasly.png",
        "giovinazzi" : "images/pilotos/Antonio Giovinazzi.png",
        "brendon_hartley" : "images/pilotos/Brendon Hartley.png",
        "stroll" : "images/pilotos/Lance Stroll.png",
        "leclerc" : "images/pilotos/Charles Leclerc.png",
        "sirotkin" : "images/pilotos/Sergey Sirotkin.png",
        "albon" : "images/pilotos/Alexander Albon.png",
        "norris" : "images/pilotos/Lando Norris.png",
        "russell" : "images/pilotos/George Russell.png",
        "aitken" : "images/pilotos/Jack Aitken.png",
        "pietro_fittipaldi" : "images/pilotos/pietro fittipaldi.png",
        "latifi" : "images/pilotos/Nicholas Latifi.png",
        "mazepin" : "images/pilotos/Nikita Mazepin.png",
        "mick_schumacher" : "images/pilotos/Mick Schumacher.png",
        "tsunoda" : "images/pilotos/Yuki Tsunoda.png",
        "de_vries" : "images/pilotos/Nick de Vries.png",
        "zhou" : "images/pilotos/Guanyu Zhou.png",
        "lawson" : "images/pilotos/Liam Lawson.png",
        "piastri" : "images/pilotos/Oscar Piastri.png",
        "sargeant" : "images/pilotos/Logan Sargeant.png",
        "bearman" : "images/pilotos/Oliver Bearman.png",
        "colapinto" : "images/pilotos/Franco Colapinto.png",
        "doohan" : "images/pilotos/Jack Doohan.png",
        "antonelli" : "images/pilotos/Andrea Kimi Antonelli.png",
        "bortoleto" : "images/pilotos/Gabriel Bortoleto.png",
        "hadjar" : "images/pilotos/Isack Hadjar.png",
    }

    return imagenPiloto[driverId] || 'null';
}

// Función para obtener la imagen de un circuito
export function getImagenCircuito(circuitId){
    // Mapa de las imágenes de los circuitos
    const imagenCircuito = {
        "albert_park" : "images/circuits/Albert Park.avif",
        "catalunya" : "images/circuits/Barcelona.avif",
        "hockenheimring" : "images/circuits/Hockenheim.avif",
        "hungaroring" : "images/circuits/Hungaroring.png",
        "imola" : "images/circuits/Enzo e Dino Ferrari.avif",
        "indianapolis" : "images/circuits/Indianapolis.png",
        "interlagos" : "images/circuits/Interlagos.avif",
        "magny_cours" : "images/circuits/Magny-Cours.png",
        "monaco" : "images/circuits/Monaco.avif",
        "monza" : "images/circuits/Monza.avif",
        "nurburgring" : "images/circuits/Nurburgring.avif",
        "red_bull_ring" : "images/circuits/Autria.avif",
        "sepang" : "images/circuits/Sepang.png",
        "silverstone" : "images/circuits/Silverstone.avif",
        "spa" : "images/circuits/Spa-Francorchamps.avif",
        "suzuka" : "images/circuits/Suzuka.avif",
        "villeneuve" : "images/circuits/gilles villeneuve.avif",
        "bahrain" : "images/circuits/bahrain.avif",
        "shanghai" : "images/circuits/shanghai.avif",
        "istanbul" : "images/circuits/Turquía.avif",
        "fuji" : "images/circuits/Fuji.png",
        "marina_bay" : "images/circuits/Singapur.avif",
        "valencia" : "images/circuits/Valencia.png",
        "yas_marina" : "images/circuits/Abu Dhabi.avif",
        "yeongam" : "images/circuits/Korea.png",
        "buddh" : "images/circuits/Buddh.png",
        "americas" : "images/circuits/Austin.avif",
        "sochi" : "images/circuits/Sochi.avif",
        "rodriguez" : "images/circuits/Hermanos Rodriguez.avif",
        "baku" : "images/circuits/Baku.avif",
        "ricard" : "images/circuits/Paul Ricard.avif",
        "mugello" : "images/circuits/Mugello.avif",
        "portimao" : "images/circuits/Algarve.avif",
        "jeddah" : "images/circuits/Jeddah.avif",
        "losail" : "images/circuits/Losail.avif",
        "zandvoort" : "images/circuits/Zandvoort.avif",
        "miami" : "images/circuits/Miami.avif",
        "vegas" : "images/circuits/Las Vegas.avif",
    }

    return imagenCircuito[circuitId] || 'null';
}

// Función para obtener la imagen de un equipo
export function getImagenEquipo(constructorId){
    // Mapa de las imágenes de los equipos
    const imagenEquipo = {
        "arrows" : "images/escuderias/Arrows.png",
        "bar" : "images/escuderias/BAR.png",
        "benetton" : "images/escuderias/Benetton.png",
        "ferrari" : "images/escuderias/Ferrari.png",
        "jaguar" : "images/escuderias/Jaguar.png",
        "jordan" : "images/escuderias/Jordan.png",
        "mclaren" : "images/escuderias/McLaren.png",
        "minardi" : "images/escuderias/Minardi.png",
        "prost" : "images/escuderias/Prost.png",
        "sauber" : "images/escuderias/Sauber.png",
        "williams" : "images/escuderias/Williams.png",
        "renault" : "images/escuderias/Renault.png",
        "toyota" : "images/escuderias/Toyota.png",
        "red_bull" : "images/escuderias/Red Bull.png",
        "bmw_sauber" : "images/escuderias/BMW.png",
        "honda" : "images/escuderias/Honda.png",
        "mf1" : "images/escuderias/MF1.png",
        "spyker_mf1" : "images/escuderias/Spyker MF1.png",
        "super_aguri" : "images/escuderias/Super Aguri.png",
        "toro_rosso" : "images/escuderias/Toro Rosso.png",
        "spyker" : "images/escuderias/Spyker.png",
        "force_india" : "images/escuderias/Force India.png",
        "brawn" : "images/escuderias/Brawn.png",
        "hrt" : "images/escuderias/HRT.png",
        "lotus_racing" : "images/escuderias/Lotus.png",
        "mercedes" : "images/escuderias/Mercedes.png",
        "virgin" : "images/escuderias/Virgin.png",
        "caterham" : "images/escuderias/Caterham.png",
        "lotus_f1" : "images/escuderias/Lotus F1.png",
        "marussia" : "images/escuderias/Marussia.png",
        "manor" : "images/escuderias/Manor Marussia.png",
        "haas" : "images/escuderias/Haas.png",
        "alfa" : "images/escuderias/Alfa Romeo.png",
        "racing_point" : "images/escuderias/Racing Point.png",
        "alphatauri" : "images/escuderias/Alpha Tauri.png",
        "alpine" : "images/escuderias/Alpine.png",
        "aston_martin" : "images/escuderias/Aston Martin.png",
        "rb" : "images/escuderias/rb.png",
    }

    return imagenEquipo[constructorId] || 'null';
}

// Función para obtener la imagen del coche de un equipo
export function getLivery(constructorId) {
    // Mapa de las imágenes de los coches de un equipo
    const livery = {
        "arrows" : "images/liverys/Arrow.jpg",
        "bar" : "images/liverys/BAR.jpg",
        "benetton" : "/images/liverys/Benetton.jpg",
        "ferrari" : "images/liverys/Ferrari.jpg",
        "jaguar" : "images/liverys/Jaguar.jpg",
        "jordan" : "images/liverys/Jordan.jpg",
        "mclaren" : "images/liverys/McLaren.jpg",
        "minardi" : "images/liverys/Minardi.jpg",
        "prost" : "images/liverys/Prost.jpg",
        "sauber" : "images/liverys/Sauber.jpg",
        "williams" : "images/liverys/Williams.jpg",
        "renault" : "images/liverys/Renault.jpg",
        "toyota" : "images/liverys/Toyota.jpg",
        "red_bull" : "images/liverys/Red Bull.jpg",
        "bmw_sauber" : "images/liverys/BMW Sauber.jpg",
        "honda" : "images/liverys/Honda.jpg",
        "mf1" : "images/liverys/MF1.jpg",
        "spyker_mf1" : "images/liverys/Spyker MF1.jpg",
        "super_aguri" : "images/liverys/Super Aguri.jpg",
        "toro_rosso" : "images/liverys/Toro Rosso.jpg",
        "spyker" : "images/liverys/Spyker.jpg",
        "force_india" : "images/liverys/Force India.jpg",
        "brawn" : "images/liverys/Brawn.jpg",
        "hrt" : "images/liverys/HRT.jpg",
        "lotus_racing" : "images/liverys/Team Lotus.jpg",
        "mercedes" : "images/liverys/Mercedes.jpg",
        "virgin" : "images/liverys/Virgin.jpg",
        "caterham" : "images/liverys/Caterham.jpg",
        "lotus_f1" : "images/liverys/Lotus F1.jpg",
        "marussia" : "images/liverys/Marussia.jpg",
        "manor" : "images/liverys/Manor Marussia.jpg",
        "haas" : "images/liverys/Haas.jpg",
        "alfa" : "images/liverys/Alfa Romeo.jpg",
        "racing_point" : "images/liverys/Racing Point.jpg",
        "alphatauri" : "images/liverys/Alpha Tauri.jpg",
        "alpine" : "images/liverys/Alpine.jpg",
        "aston_martin" : "images/liverys/Aston Martin.jpg",
        "rb" : "images/liverys/RB.jpg",
    }
    return livery[constructorId] || 'null';
}