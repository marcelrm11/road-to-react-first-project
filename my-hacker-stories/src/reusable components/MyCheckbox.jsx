import React from "react";

const MyCheckbox = ({
  id,
  name = id,
  label = id,
  capitalize = true,
  checked,
  handleChange,
}) => {
  if (capitalize) {
    label = label[0].toUpperCase() + label.slice(1);
  }
  return (
    <div>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={handleChange}
      />
      <label>{label}</label>
    </div>
  );
};

export default MyCheckbox;
