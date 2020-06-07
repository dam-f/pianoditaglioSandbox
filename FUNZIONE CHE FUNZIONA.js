//PER IL MOMENTO QUESTA CALCOLA LA SOLUZIONE CON MENO SCARTO

// creare un valore impostabile di min lunghezza sfridi
//creare un comando per cui si puÃ² scegliere tra: soluzione con minor scarto (lasciando sfridi piÃ¹ lunghi di tot), soluzione con minor numero di tagli(per quando si ha fretta), soluzione che usa meno barre intere


let ordine1 = [ 
                  [186,199.2],
                  [714,139.2],
                  [248,119.2],
                  [186,109.2],
                  [280,89.2]
              ]

let sfridi = [
                  [20,100],
                  [20,180],
                  [2,220],
                  [20,70]
              ]

let maxScarto = 15;             
let minSfrido = 65;
let larghezzaLama = 0.5;

let tutteLeComb = [];
let combTemp = [];
let combMigliore;
let pianoDiTaglioCompleto = [];

let barreUtilizzate = 0;
let scartoTotale = 0;

let barreDaRecuperareAllaFine = [];


function ciStaAncora(misura, comb, barraRimanente=650) {
    let lungTemp = /*sumArr(comb)*/(comb.reduce(function (a, b) { return a + b;}, 0))+(larghezzaLama*comb.length);
    if (misura<(650-lungTemp) && ((650-lungTemp-misura)>minSfrido || (650-lungTemp-misura)<maxScarto)) {
      //console.log("ci sta ancora!");
      return true;
    } else {
      //console.log(`comb ${comb}: la misura ${misura} non sta piÃ¹ nei ${650-lungTemp} che rimangono alla barra, che era lunga ${barraRimanente}`);
      return false;
    }
}

function aggiungiCombConMisura(misura) {
  combTemp = [];
  combTemp.push(misura)
}

//questa si deve migliorare facendo in modo che vada ad operare solo sul livello di combo aggiunto in precedenza  
function creaTutteLeCombPossibili(arrayMisure) {
      
    let misPiccola = arrayMisure[arrayMisure.length-1];


    // PER OGNI MISURA CREO UNA NUOVA COMB
    for (let i = 0; i < arrayMisure.length; i++) {
      aggiungiCombConMisura(arrayMisure[i])
      tutteLeComb.push(combTemp);
    }
    //PROVA
    console.log("TutteLeComb dopo il primo giro: ", tutteLeComb);
    
    let numTagliMassimi = Math.round(650/(misPiccola+0.5));
    
    //PROVA
    console.log("Numero tagli massimi: ", numTagliMassimi);
    
    for (let k = 0; k<numTagliMassimi; k++) {
      let tempArrCombLength = tutteLeComb.length;
      for (let i = 0; i < tempArrCombLength; i++) {
        let barraRimasta = 650-(tutteLeComb[i].reduce(function (a, b) { return a + b;}, 0));
        for (let j = 0; j < arrayMisure.length; j++)
          if ( ciStaAncora(arrayMisure[j], tutteLeComb[i], barraRimasta)) {
            let newComb = tutteLeComb[i].slice(0);
            newComb.push(arrayMisure[j]);
            tutteLeComb.push(newComb)
        }
      }
      //PROVA
      console.log(`TutteLeComb dopo il ${k+1} giro: `, tutteLeComb);
    }
}

function trovaCombMigliore(allCombs) {
  let bestComb = [allCombs[0]]
    for (let i = 0; i<allCombs.length; i++) {
      let scartoBestComb = 650-bestComb[0].reduce(function (a, b) { return a + b;}, 0);
      let scartoThisComb = 650-allCombs[i].reduce(function (a, b) { return a + b;}, 0);
            
      if (scartoBestComb>scartoThisComb) {
        bestComb = [allCombs[i], scartoThisComb]
      }
    }
    return bestComb
}

function quanteBarreConQuestaComb(comb, ordine) {
  let numBarreConQuestaComb = 0;
  let hoFinitoDiTagliareUnaMisura = false
 
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
          ordineFittizio[j][0] = ordineFittizio[j][0]-1;
          if (ordineFittizio[j][0] === 0) {
            console.log("Ho finito di tagliare la misura fittizia ", ordineFittizio[j][1])
            hoFinitoDiTagliareUnaMisuraFittizia = true;
            misuraDaTogliereDallOrdine = ordineFittizio[j][1]
          }
        }    
      }
    }
    numBarreConQuestaComb++
  }

  console.log("MISURA DA TOGLIERE DALL'ORDINE: ", misuraDaTogliereDallOrdine)
  console.log("ORDINE: "+ordine)

  let nonVaBeneCosi = false
  for (let i = 0; i < ordineFittizio.length; i++) {
    if (ordineFittizio[i][0]<0) {
      nonVaBeneCosi = true;
      barreDaRecuperareAllaFine.push(ordineFittizio[i][1])
    }
  }

  if (nonVaBeneCosi) {
    numBarreConQuestaComb--
  }
  
  if (!nonVaBeneCosi) {
    while (!hoFinitoDiTagliareUnaMisura) {
      for (let i = 0; i < comb[0].length; i++) {
        for (let j = 0; j < ordine.length; j++) {
          if (comb[0][i] === ordine[j][1]) {
            ordine[j][0] = ordine[j][0]-1;
            if (ordine[j][0] === 0) {
              console.log("Ho finito di tagliare la misura ", ordine[j][1])
              hoFinitoDiTagliareUnaMisura = true
              //COSA MOLTO PERICOLOSA:
              ordine.splice(j,1)
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
            ordine[j][0] = ordine[j][0]-1;
            }
          }    
        }
      }
    }
    
  for (let i = 0; i < ordine.length; i++) {
    if (ordine[i][1] === misuraDaTogliereDallOrdine) {
      ordine.splice(i,1)
    }
  }
  
  console.log("ORDINE DOPO AVER TOLTO MISURA: "+ordine)
  console.log("RISULTATO: "+numBarreConQuestaComb+" barre tagliate cosÃ¬:  "+comb[0]+" con scarto: "+comb[1])

  pianoDiTaglioCompleto.push([numBarreConQuestaComb, "barre tagliate cosÃ¬: ", comb[0], " con scarto: ", comb[1]])
}

function pianoDiTaglio(ordine) {

  tutteLeComb = []

  // creo una array solo delle misure
  const arrayMisure = []
  ordine.forEach((e, i) => arrayMisure.push(e[1]))
  /*nel caso dell'ordine2 che Ã¨ una array di oggetti
  ordine.forEach((e, i) => arrayMisure.push(e.larg))
  */
  // ORDINO LA ARRAY IN BASE ALLE MISURE
  arrayMisure.sort(function(a,b){return b[1] - a[1]});

  creaTutteLeCombPossibili(arrayMisure)

  combMigliore = trovaCombMigliore(tutteLeComb)
  
  console.log("combMigliore: ", combMigliore)

  quanteBarreConQuestaComb(combMigliore, ordine)
  console.log(ordine);


  if (ordine.length>0) {
    pianoDiTaglio(ordine)
  }

  
} 


function statistichePiano(piano) {
  
  for (let i = 0; i < piano.length; i++) {
    barreUtilizzate = barreUtilizzate + piano[i][0]
    scartoTotale = scartoTotale + (piano[i][4]*piano[i][0])
  }

}


function pianoConStatistiche(ordine) {
  pianoDiTaglio(ordine)
  statistichePiano(pianoDiTaglioCompleto)
  pianoDiTaglioCompleto.unshift(["Barre utilizzate: "+ barreUtilizzate,"Scarto totale: "+scartoTotale])
  pianoDiTaglioCompleto.push("(SOLUZ. TEMPORANEA) Infine taglia queste stecche dagli sfridi o da una nuova barra (se sono molte puoi calcolare un nuovo piano di taglio) :", barreDaRecuperareAllaFine);
}

pianoConStatistiche(ordine1);

console.log(pianoDiTaglioCompleto)

//OUTPUT
let exampleOutput = [
    [
      "Barre utilizzate: 329",
      "Scarto totale: 3018.000000000002"
    ],
    [
      93,
      "barre tagliate cosÃ¬: ",
      [
        199.2,
        199.2,
        139.2,
        109.2
      ],
      " con scarto: ",
      3.2000000000000455
    ],
    [
      155,
      "barre tagliate cosÃ¬: ",
      [
        139.2,
        139.2,
        139.2,
        139.2,
        89.2
      ],
      " con scarto: ",
      4
    ],
    [
      62,
      "barre tagliate cosÃ¬: ",
      [
        119.2,
        119.2,
        119.2,
        109.2,
        89.2,
        89.2
      ],
      " con scarto: ",
      4.7999999999999545
    ],
    [
      15,
      "barre tagliate cosÃ¬: ",
      [
        119.2,
        119.2,
        119.2,
        109.2,
        109.2
      ],
      " con scarto: ",
      74
    ],
    [
      4,
      "barre tagliate cosÃ¬: ",
      [
        119.2,
        119.2,
        119.2,
        119.2
      ],
      " con scarto: ",
      173.2
    ],
    "(SOLUZ. TEMPORANEA) Infine taglia queste stecche dagli sfridi o da una nuova barra (se sono molte puoi calcolare un nuovo piano di taglio) :",
    [
      139.2,
      89.2,
      109.2,
      119.2
    ]
  ]