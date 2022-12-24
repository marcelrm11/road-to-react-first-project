import React from "react";

const MyButton = ({ children, type = "button", handleClick, ...rest }) => {
  return (
    <button type={type} onClick={handleClick} {...rest}>
      {children}
    </button>
  );
};

export default MyButton;
