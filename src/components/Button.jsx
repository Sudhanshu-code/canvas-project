import React from "react";
import download from "../images/download.png";
import reset from "../images/reset.png";

function Button({ text, className = "", ...rest }) {
  return (
    <button
      className={`${className} ${
        text == "Download" || text == "Reset" ? "bg-transparent" : ""
      } `}
      {...rest}
    >
      {text == "Download" ? (
        <img src={download} height={30} width={30} alt={text} />
      ) : text == "Reset" ? (
        <img src={reset} height={30} width={30} alt={text} />
      ) : (
        text
      )}
    </button>
  );
}

export default Button;
