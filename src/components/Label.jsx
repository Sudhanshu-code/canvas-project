import React from "react";

function Label({ label, className = "", ...rest }) {
  return (
    <label
      className={`items-center text-center text-base leading-4 text-wrap ${className}`}
      {...rest}
    >
      {label}
    </label>
  );
}

export default Label;
