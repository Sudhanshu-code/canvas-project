import React, { useId } from "react";

function Input({
  className = "",
  type = "text",
  value,
  label,
  labelClass,
  labelFor,
  ...rest
}) {
  const id = useId();
  return (
    <input
      id={id}
      className={`${className}`}
      type={type}
      value={value}
      {...rest}
    />
  );
}

export default Input;
