import React from "react";

function InputMisure() {
  return (
    <div>
      <form
        className="bg-light-green br3 flex items-end pa2
            "
      >
        <label>
          N. stecche
          <input
            className="input-reset ba b--black-20 pa2 mb2 db w-100"
            type="number"
            id="numStecche"
            name="numStecche"
          />
        </label>
        <label>
          Misura taglio
          <input
            className="input-reset ba b--black-20 pa2 mb2 db w-100"
            type="number"
            id="misura"
            name="misura"
          />
        </label>
        <br />
        <br />
        <label>
          <input
            className="input-reset ba b--black-20 pa2 mb2 db w-100"
            type="submit"
            value="Aggiungi"
          />
        </label>
      </form>
    </div>
  );
}

export default InputMisure;
