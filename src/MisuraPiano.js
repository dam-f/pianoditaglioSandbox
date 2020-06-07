import React from "react";

//[ 93, "barre tagliate così: ",[199.2,199.2,139.2,109.2]," con scarto: ",3.2000000000000455]

function MisuraPiano(props) {
  return (
    <div className="bb b--black-30 pl3 flex justify-between pr3 items-center">
      <p>
        - <strong>{props.combPiano[0]}</strong> barre tagliate così:{" "}
        <strong>{props.combPiano[2].join(", ")}</strong>
        <br />
        (scarto {Math.round(props.combPiano[4] * 100 + Number.EPSILON) /
          100}{" "}
        cm)
      </p>
    </div>
  );
}

export default MisuraPiano;
