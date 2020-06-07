import React from "react";
import MisuraPiano from "./MisuraPiano";

/*
let exampleOutput = [
  [ "Barre utilizzate: ", 329, "Scarto totale: ", 3018.000000000002],
  [ 93, "barre tagliate così: ",[199.2,199.2,139.2,109.2]," con scarto: ",3.2000000000000455],
  [ 155,"barre tagliate così: ",[139.2,139.2,139.2,139.2,89.2]," con scarto: ",4],
  [ 62, "barre tagliate così: ",[119.2,119.2,119.2,109.2,89.2,89.2]," con scarto: ",4.7999999999999545],
  [ 15, "barre tagliate così: ",[119.2,119.2,119.2,109.2,109.2]," con scarto: ",74],
  [ 4,  "barre tagliate così: ",[119.2,119.2,119.2,119.2]," con scarto: ",173.2],
  "(SOLUZ. TEMPORANEA) Infine taglia queste stecche dagli sfridi o da una nuova barra (se sono molte puoi calcolare un nuovo piano di taglio) :",
  [139.2,89.2,109.2,119.2]
]
*/

function Pianoditaglio(props) {
  function creaComponenteMisura(comb) {
    return <MisuraPiano combPiano={comb} />;
  }

  let profilo = props.profilo;
  let barreNeiPacchi = 0;

  if (profilo === "AL/1") {
    barreNeiPacchi = 50;
  } else if (profilo === "AC/6") {
    barreNeiPacchi = 10;
  } else if (profilo === "AL/2HD") {
    barreNeiPacchi = 15;
  } else if (profilo === "AL/2") {
    barreNeiPacchi = 30;
  }

  const piano = props.piano;

  const barrePianoUtilizzate = piano[0][1];
  const scartoPianoTotale = piano[0][3];
  const pacchiNecessari = Math.floor(barrePianoUtilizzate / barreNeiPacchi);
  const barreNecessarieOltreAiPacchi = barrePianoUtilizzate % barreNeiPacchi;

  let pianoPerRender = piano.slice(0);

  console.log(pianoPerRender);

  pianoPerRender.shift();
  pianoPerRender.pop();
  pianoPerRender.pop();

  //FARE UNA FUNZIONE che si passa le stecche avanzate da tagliare e riunisce le misure guali con un 3x davanti (se ad es. la misura è ripetuta 3 volte). for loop con se le due misure sono uguali una viene splice-ata e l'altra si aggiunge un numx dove il nume parte da 1(x tutte le misure, in automatico, e poi aggiunge a num++)

  return (
    <div>
      <p className="tc">
        BARRE NECESSARIE: <strong>{barrePianoUtilizzate}</strong> (
        <strong>{pacchiNecessari}</strong> pacchi e{" "}
        <strong>{barreNecessarieOltreAiPacchi}</strong> stecche)
      </p>
      <div className="bg-white pa2 br4 pb4 bb bw2">
        {pianoPerRender.map(creaComponenteMisura)}
        <br />
        <br />
        <p className="bb b--black-30 pl3">
          Oh, e cerca tra gli sfridi qualcosa per tagliare ancora queste
          stecche:
          <br />
          <br />
          <strong>{piano[piano.length - 1].join(",  ")}</strong>
          <br />
          <br />
        </p>
      </div>
      {/*La statistica dello scarto sarà riattivata solo quando verrano contati solo gli scarti minori del maxScarto*/}
      {/*<p>Scarto totale sull'intero ordine: {scartoPianoTotale}</p>*/}
      <p>{/*props.piano.map(creaComponenteMisura)*/}</p>
    </div>
  );
}

export default Pianoditaglio;
