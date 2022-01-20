import React from "react";
import "./Button.css"

const Button = ({ value, width, height, clicked }) => {
  return(
    <div style={clicked ? {backgroundColor: "black", color: "gray", borderRadius: "5px",height: height,  width: width}: {height: height, width: width}} className="Button__container noselect">
      <h2 style={clicked ? {color: "grey"} : null} className="Button__h2">{value}</h2>
    </div> 
  )
}

export default Button;