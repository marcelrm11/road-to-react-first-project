import React from "react";

const MyDropdown = ({
  id,
  name = id,
  label,
  options,
  selectMsg = "--Please choose an option--",
  capitalize = true,
  handleChange,
}) => {
  return (
    <>
      {label ? <label htmlFor={id}>{label}</label> : ""}
      <select name={name} id={id}>
        <option value="" disabled>
          {selectMsg}
        </option>
        {options.map((option) => (
          <option value={option} key={option}>
            {capitalize ? option[0].toUpperCase() + option.slice(1) : option}
          </option>
        ))}
      </select>
    </>
  );
};

export default MyDropdown;
