import React from "react";

function Misura(props) {
  return (
    <div className="bb b--black-30 pl3 flex justify-between pr3 items-center">
      <p>
        - <strong>{props.numStecche}</strong> stecche da{" "}
        <strong>{props.misuraStecca}</strong> cm
      </p>

      <small className="">
        <input className="" type="button" value="elimina" />
      </small>
    </div>
  );
}

export default Misura;
