import axios from "axios";
import { useEffect, useState } from "react";

const Pilotos = () => {
  const [pilotos, setPilotos] = useState([]);

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
    "karthikeyan" : "images/pilotos/Narain Karthikeyan.png",
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
    "markus_winkelhock" : "images/pilotos/Markus Winkelhock.png",
    "bourdais" : "images/pilotos/Sebastien Bourdais.png",
    "piquet_jr" : "images/pilotos/Nelson Piquet Jr.png",
    "alguersuari" : "images/pilotos/Jaime Alguersuari.png",
    "badoer" : "images/pilotos/Luca Badoer.png",
    "buemi" : "images/pilotos/Sebastien Buemi.png",
    "grosjean" : "images/pilotos/Romain Grosjean.png",
    "kobayashi" : "images/pilotos/Kamui Kobayashi.png",
    "chandhok" : "images/pilotos/Karun Chandhok.png",
    "grassi" : "images/pilotos/Lucas Di Grassi.png",
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
    "garde" : "images/pilotos/Giedo van der Garde.png",
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
    "pietro_fittipaldi" : "images/pilotos/Pietro Fittipaldi.png",
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
    "antonelli" : "images/pilotos/Kimi Andrea Antonelli.png",
    "bortoleto" : "images/pilotos/Gabriel Bortoleto.png",
    "hadjar" : "images/pilotos/Isack Hadjar.png",
  }

  useEffect(() => {
    axios.get("http://localhost:3000/api/pilotos") // Asegúrate que tu backend está corriendo
      .then(response => {
        setPilotos(response.data);
      })
      .catch(error => {
        console.error("Error al obtener los pilotos:", error);
      });
  }, []);

  return (
    <div style={{ fontFamily: "Arial", padding: "20px", textAlign: "center" }}>
      <h1>Lista de Pilotos</h1>
      <table border="1" style={{ width: "100%", textAlign: "center" }}>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Nacionalidad</th>
          </tr> 
        </thead>
        <tbody>
          {pilotos.map((piloto) => (
            <tr key={piloto.idPilotos}>
              <td>
                <img src={imagenPiloto[piloto.driverId]} alt={piloto.driverId} style={{ width: "150px", height: "150px" }} />
              </td>
              <td>{piloto.nombrePiloto}</td>
              <td>{piloto.apellidoPiloto}</td>
              <td>{piloto.nacionalidadPiloto}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Pilotos;
