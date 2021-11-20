import React from "react";
import "./Button.css"

const Button = ({ value, width }) => {
  return(
    <div style={{width: width}} className="Button__container">
      <h2 className="Button__h2">{value}</h2>
    </div> 
  )
}

export default Button;