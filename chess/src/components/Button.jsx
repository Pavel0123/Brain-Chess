import React from "react";
import "./Button.css"

const Button = ({ value, width, clicked }) => {
  return(
    <div style={clicked ? {backgroundColor: "black", color: "gray", borderRadius: "5px", width: width}: {width: width}} className="Button__container">
      <h2 style={clicked ? {color: "grey"} : null} className="Button__h2">{value}</h2>
    </div> 
  )
}

export default Button;