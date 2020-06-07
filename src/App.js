import React, { useState } from "react";
import Ordine from "./Ordine";
//import Opzioni from "./Opzioni";
import Pianoditaglio from "./Pianoditaglio";
import Misura from "./Misura";

//AGGIUNGERE GESTIONE SFRIDI

function App() {
  const [teloCorrente, setTeloCorrente] = useState({
    steccheCorrente: "",
    misuraCorrente: ""
  });

  const [ordineSandbox, setOrdine] = useState([
    [186, 199.2],
    [714, 139.2],
    [248, 119.2],
    [186, 109.2],
    [280, 89.2]
  ]);

  const [pianoDiTaglioDaRenderizzare, setPiano] = useState([
    ["Barre utilizzate: ", 329, "Scarto totale: ", 3018.000000000002],
    [
      93,
      "barre tagliate così: ",
      [199.2, 199.2, 139.2, 109.2],
      " con scarto: ",
      3.2000000000000455
    ],
    [
      155,
      "barre tagliate così: ",
      [139.2, 139.2, 139.2, 139.2, 89.2],
      " con scarto: ",
      4
    ],
    [
      62,
      "barre tagliate così: ",
      [119.2, 119.2, 119.2, 109.2, 89.2, 89.2],
      " con scarto: ",
      4.7999999999999545
    ],
    [
      15,
      "barre tagliate così: ",
      [119.2, 119.2, 119.2, 109.2, 109.2],
      " con scarto: ",
      74
    ],
    [
      4,
      "barre tagliate così: ",
      [119.2, 119.2, 119.2, 119.2],
      " con scarto: ",
      173.2
    ],
    "(SOLUZ. TEMPORANEA) Infine taglia queste stecche dagli sfridi o da una nuova barra (se sono molte puoi calcolare un nuovo piano di taglio) :",
    [139.2, 89.2, 109.2, 119.2]
  ]);

  const [sfridi, setSfridi] = useState([]);

  const [profilo, setProfilo] = useState("AL/1");

  const [opzioni, setOpzioni] = useState({
    maxScarto: 15,
    minSfrido: 65,
    larghezzaLama: 0.5
  });

  function impostaOpzioni(event) {
    const newValue = event.target.value;
    const inputName = event.target.name;
    setOpzioni(prevValue => {
      if (inputName === "opzioneScarto") {
        return {
          maxScarto: newValue,
          minSfrido: prevValue.minSfrido,
          larghezzaLama: prevValue.larghezzaLama
        };
      } else if (inputName === "opzioneSfrido") {
        return {
          maxScarto: prevValue.maxScarto,
          minSfrido: newValue,
          larghezzaLama: prevValue.larghezzaLama
        };
      } else if (inputName === "opzioneLama") {
        return {
          maxScarto: prevValue.maxScarto,
          minSfrido: prevValue.minSfrido,
          larghezzaLama: newValue
        };
      }
    });
  }

  function impostaProfilo(event) {
    const newValue = event.target.value;
    if (newValue === "AL/1") {
      setProfilo("AL/1");
    } else if (newValue === "AC/6") {
      setProfilo("AC/6");
    } else if (newValue === "AL/2HD") {
      setProfilo("AL/2HD");
    } else if (newValue === "AL/2") {
      setProfilo("AL/2");
    }
  }

  function impostaMisuraCorrente(event) {
    const newValue = event.target.value;
    const inputName = event.target.name;
    setTeloCorrente(prevValue => {
      if (inputName === "numStecche") {
        return {
          steccheCorrente: newValue,
          misuraCorrente: prevValue.misuraCorrente
        };
      } else if (inputName === "misura") {
        return {
          steccheCorrente: prevValue.steccheCorrente,
          misuraCorrente: newValue
        };
      }
    });
  }

  function aggiungiMisuraCorrente(event) {
    event.preventDefault();
    setOrdine(prevValue => {
      if (
        teloCorrente.steccheCorrente &&
        teloCorrente.misuraCorrente &&
        (teloCorrente.steccheCorrente > 0 && teloCorrente.misuraCorrente > 0)
      ) {
        // const st = Number()
        return [
          ...prevValue,
          [
            Number(teloCorrente.steccheCorrente),
            Number(teloCorrente.misuraCorrente)
          ]
        ];
      } else {
        return prevValue;
      }
    });
    setTeloCorrente({
      steccheCorrente: "",
      misuraCorrente: ""
    });
  }

  //PER IL MOMENTO QUESTA CALCOLA LA SOLUZIONE CON MENO SCARTO

  // creare un valore impostabile di min lunghezza sfridi
  //creare un comando per cui si può scegliere tra: soluzione con minor scarto (lasciando sfridi più lunghi di tot), soluzione con minor numero di tagli(per quando si ha fretta), soluzione che usa meno barre intere
  function pianoSandbox() {
    let tutteLeComb = [];
    let combTemp = [];
    let combMigliore;
    let pianoDiTaglioCompleto = [];

    let barreUtilizzate = 0;
    let scartoTotale = 0;

    let barreDaRecuperareAllaFine = [];

    function ciStaAncora(misura, comb, barraRimanente = 650) {
      let lungTemp =
        /*sumArr(comb)*/ comb.reduce(function(a, b) {
          return a + b;
        }, 0) +
        larghezzaLama * comb.length;
      if (
        misura < 650 - lungTemp &&
        (650 - lungTemp - misura > minSfrido ||
          650 - lungTemp - misura < maxScarto)
      ) {
        //console.log("ci sta ancora!");
        return true;
      } else {
        //console.log(`comb ${comb}: la misura ${misura} non sta piÃ¹ nei ${650-lungTemp} che rimangono alla barra, che era lunga ${barraRimanente}`);
        return false;
      }
    }

    function aggiungiCombConMisura(misura) {
      combTemp = [];
      combTemp.push(misura);
    }

    //questa si deve migliorare facendo in modo che vada ad operare solo sul livello di combo aggiunto in precedenza
    function creaTutteLeCombPossibili(arrayMisure) {
      let misPiccola = arrayMisure[arrayMisure.length - 1];

      // PER OGNI MISURA CREO UNA NUOVA COMB
      for (let i = 0; i < arrayMisure.length; i++) {
        aggiungiCombConMisura(arrayMisure[i]);
        tutteLeComb.push(combTemp);
      }
      //PROVA
      console.log("TutteLeComb dopo il primo giro: ", tutteLeComb);

      let numTagliMassimi = Math.round(650 / (misPiccola + 0.5));

      //PROVA
      console.log("Numero tagli massimi: ", numTagliMassimi);

      for (let k = 0; k < numTagliMassimi; k++) {
        let tempArrCombLength = tutteLeComb.length;
        for (let i = 0; i < tempArrCombLength; i++) {
          let barraRimasta =
            650 -
            tutteLeComb[i].reduce(function(a, b) {
              return a + b;
            }, 0);
          for (let j = 0; j < arrayMisure.length; j++)
            if (ciStaAncora(arrayMisure[j], tutteLeComb[i], barraRimasta)) {
              let newComb = tutteLeComb[i].slice(0);
              newComb.push(arrayMisure[j]);
              tutteLeComb.push(newComb);
            }
        }
        //PROVA
        console.log(`TutteLeComb dopo il ${k + 1} giro: `, tutteLeComb);
      }
    }

    function trovaCombMigliore(allCombs) {
      let bestComb = [allCombs[0]];
      for (let i = 0; i < allCombs.length; i++) {
        let scartoBestComb =
          650 -
          bestComb[0].reduce(function(a, b) {
            return a + b;
          }, 0);
        let scartoThisComb =
          650 -
          allCombs[i].reduce(function(a, b) {
            return a + b;
          }, 0);

        if (scartoBestComb > scartoThisComb) {
          bestComb = [allCombs[i], scartoThisComb];
        }
      }
      return bestComb;
    }

    function quanteBarreConQuestaComb(comb, ordine) {
      let numBarreConQuestaComb = 0;
      let hoFinitoDiTagliareUnaMisura = false;

      let combFittizia = comb[0].slice(0);
      let ordineFittizio = [];
      for (let i = 0; i < ordine.length; i++) {
        ordineFittizio[i] = ordine[i].slice();
      }
      let hoFinitoDiTagliareUnaMisuraFittizia = false;

      let misuraDaTogliereDallOrdine;

      while (!hoFinitoDiTagliareUnaMisuraFittizia) {
        for (let i = 0; i < combFittizia.length; i++) {
          for (let j = 0; j < ordineFittizio.length; j++) {
            if (combFittizia[i] === ordineFittizio[j][1]) {
              ordineFittizio[j][0] = ordineFittizio[j][0] - 1;
              if (ordineFittizio[j][0] === 0) {
                console.log(
                  "Ho finito di tagliare la misura fittizia ",
                  ordineFittizio[j][1]
                );
                hoFinitoDiTagliareUnaMisuraFittizia = true;
                misuraDaTogliereDallOrdine = ordineFittizio[j][1];
              }
            }
          }
        }
        numBarreConQuestaComb++;
      }

      console.log(
        "MISURA DA TOGLIERE DALL'ORDINE: ",
        misuraDaTogliereDallOrdine
      );
      console.log("ORDINE: " + ordine);

      let nonVaBeneCosi = false;
      for (let i = 0; i < ordineFittizio.length; i++) {
        if (ordineFittizio[i][0] < 0) {
          nonVaBeneCosi = true;
          barreDaRecuperareAllaFine.push(ordineFittizio[i][1]);
        }
      }

      if (nonVaBeneCosi) {
        numBarreConQuestaComb--;
      }

      if (!nonVaBeneCosi) {
        while (!hoFinitoDiTagliareUnaMisura) {
          for (let i = 0; i < comb[0].length; i++) {
            for (let j = 0; j < ordine.length; j++) {
              if (comb[0][i] === ordine[j][1]) {
                ordine[j][0] = ordine[j][0] - 1;
                if (ordine[j][0] === 0) {
                  console.log("Ho finito di tagliare la misura ", ordine[j][1]);
                  hoFinitoDiTagliareUnaMisura = true;
                  //COSA MOLTO PERICOLOSA:
                  ordine.splice(j, 1);
                }
              }
            }
          }
          //numBarreConQuestaComb++
        }
      } else {
        for (let i = 0; i < numBarreConQuestaComb; i++) {
          for (let i = 0; i < comb[0].length; i++) {
            for (let j = 0; j < ordine.length; j++) {
              if (comb[0][i] === ordine[j][1]) {
                ordine[j][0] = ordine[j][0] - 1;
              }
            }
          }
        }
      }

      for (let i = 0; i < ordine.length; i++) {
        if (ordine[i][1] === misuraDaTogliereDallOrdine) {
          ordine.splice(i, 1);
        }
      }

      console.log("ORDINE DOPO AVER TOLTO MISURA: " + ordine);
      console.log(
        "RISULTATO: " +
          numBarreConQuestaComb +
          " barre tagliate cosÃ¬:  " +
          comb[0] +
          " con scarto: " +
          comb[1]
      );

      pianoDiTaglioCompleto.push([
        numBarreConQuestaComb,
        "barre tagliate cosÃ¬: ",
        comb[0],
        " con scarto: ",
        comb[1]
      ]);
    }

    function pianoDiTaglio(ordine) {
      tutteLeComb = [];

      // creo una array solo delle misure
      const arrayMisure = [];
      ordine.forEach((e, i) => arrayMisure.push(e[1]));
      /*nel caso dell'ordine2 che Ã¨ una array di oggetti
    ordine.forEach((e, i) => arrayMisure.push(e.larg))
    */
      // ORDINO LA ARRAY IN BASE ALLE MISURE
      arrayMisure.sort(function(a, b) {
        return b[1] - a[1];
      });

      creaTutteLeCombPossibili(arrayMisure);

      combMigliore = trovaCombMigliore(tutteLeComb);

      console.log("combMigliore: ", combMigliore);

      quanteBarreConQuestaComb(combMigliore, ordine);
      console.log(ordine);

      if (ordine.length > 0) {
        pianoDiTaglio(ordine);
      }
    }

    function statistichePiano(piano) {
      for (let i = 0; i < piano.length; i++) {
        barreUtilizzate = barreUtilizzate + piano[i][0];
        scartoTotale = scartoTotale + piano[i][4] * piano[i][0];
      }
    }

    function pianoConStatistiche(ordine) {
      pianoDiTaglio(ordine);
      statistichePiano(pianoDiTaglioCompleto);
      pianoDiTaglioCompleto.unshift([
        "Barre utilizzate: ",
        barreUtilizzate,
        "Scarto totale: ",
        scartoTotale
      ]);
      pianoDiTaglioCompleto.push(
        "(SOLUZ. TEMPORANEA) Infine taglia queste stecche dagli sfridi o da una nuova barra (se sono molte puoi calcolare un nuovo piano di taglio) :",
        barreDaRecuperareAllaFine
      );
    }

    pianoConStatistiche(ordine1);

    console.log(pianoDiTaglioCompleto);

    //OUTPUT
  }

  return (
    <div className="flex flex-wrap">
      <div className="bg-gray pt2 fl w-100-ns w-100-m w-40-l">
        {/*<Ordine ordine={ordine} />*/}
        <h1 className="pl2 pa1 bg-gold w-100">ORDINE</h1>
        <div className="pa3">
          <form
            className="bg- br3 flex items-end pa2
            "
          >
            <label className="mr2">
              <strong>N. stecche</strong>
              <br />
              <br />
              <input
                className="input-reset ba b--black-20 pa2 mb2 db w-100"
                type="number"
                id="numStecche"
                name="numStecche"
                value={teloCorrente.steccheCorrente}
                onChange={impostaMisuraCorrente}
              />
            </label>
            <label className="mr2">
              <strong>Misura taglio</strong>
              <br />
              <br />
              <input
                className="input-reset ba b--black-20 pa2 mb2 db w-100"
                type="number"
                id="misura"
                name="misura"
                value={teloCorrente.misuraCorrente}
                onChange={impostaMisuraCorrente}
              />
            </label>
            <br />
            <br />
            <label>
              <input
                className="input-reset bg-blue white b ba b--black-20 pa2 mb2 db w-100"
                type="submit"
                value="Aggiungi"
                onClick={aggiungiMisuraCorrente}
              />
            </label>
          </form>
          <br />
          <div className="pa2 br4">
            <Ordine ordine={ordineSandbox} />
          </div>
        </div>
      </div>
      <div className="bg-blue pt2 fl w-100-ns w-100-m w-20-l">
        {/*Opzioni*/}
        <h1 className="pl2 pa1 bg-gold w-100">OPZIONI</h1>
        <div className="flex items-start flex-wrap pa3">
          <label className="w-third pa2">
            <strong>SCARTO MAX</strong>
            <br />
            <br />
            <input
              className="input-reset ba b--black-20 pa2 mb2 db w-100"
              name="opzioneScarto"
              type="number"
              value={opzioni.maxScarto}
              onChange={impostaOpzioni}
            />
            <small id="name-desc" class="f6 db mb2">
              Lunghezza massimo scarto
            </small>
          </label>
          <label className="w-third pa2">
            <strong>SCARTO MIN</strong>
            <br />
            <br />
            <input
              className="input-reset ba b--black-20 pa2 mb2 db w-100"
              name="opzioneSfrido"
              type="number"
              value={opzioni.minSfrido}
              onChange={impostaOpzioni}
            />
            <small id="name-desc" class="f6 db mb2">
              Lunghezza minima sfrido
            </small>
          </label>
          <label className="w-third pa2">
            <strong>LAMA</strong>
            <br />
            <br />
            <input
              className="input-reset ba b--black-20 pa2 mb2 db w-100"
              name="opzioneLama"
              type="number"
              value={opzioni.larghezzaLama}
              onChange={impostaOpzioni}
            />
            <small id="name-desc" class="f6 db mb2">
              Larghezza lama (imposta 0.5 per alluminio, 0.2 per acciaio):
            </small>
          </label>
          <label className="w-third pa2">
            <strong>PROFILO</strong>
            <br />
            <br />
            <fieldset
              className="input-reset bw0 pa0 w-100"
              onChange={impostaProfilo}
            >
              <select
                name="profilo"
                className="input-reset ba b--black-20 pa2 mb2 db w-100"
              >
                <option value="AL/1" selected="selected">
                  AL/1
                </option>
                <option value="AC/6">AC/6</option>
                <option value="AL/2HD">AL/2 HD</option>
                <option value="AL/2">AL/2</option>
              </select>
            </fieldset>
            <small id="name-desc" class="f6 db mb2">
              Info usata per calcolare il numero dei pacchi necessari:
            </small>
          </label>
        </div>
        {/*<small className="tc self-end">creato da Damiano nel 2020.</small>*/}
      </div>
      <div className="bg-gold pt2 fl w-100-ns w-100-m w-40-l pa3">
        <h1 className="pl2 pa1">PIANO</h1>
        <p className="pl2 tc">
          <input
            className="b"
            type="button"
            name="creaPiano"
            onClick={pianoSandbox}
            value="CREA PIANO"
          />
        </p>
        <Pianoditaglio piano={pianoDiTaglioDaRenderizzare} profilo={profilo} />
      </div>
    </div>
  );
}

export default App;
