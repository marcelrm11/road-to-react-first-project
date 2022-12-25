import React, { Children } from "react";

const MyRadioButton = ({
  id,
  name,
  value = id,
  label = id,
  capitalize = true,
  checked,
  onChange,
}) => {
  if (capitalize) {
    label = label[0].toUpperCase() + label.slice(1);
  }
  return (
    <div>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      ></input>
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

const MyRadioGroup = ({ children, options, name }) => {
  return (
    <fieldset>
      <legend>{children}</legend>
      {options.map((option) => (
        <MyRadioButton id={option} name={name} key={option} />
      ))}
    </fieldset>
  );
};

export { MyRadioButton, MyRadioGroup };
