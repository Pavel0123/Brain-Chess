import React from "react";
import "./Box.css"

const Box = ({ value, width, text }) => {
  return(
    <div style={{width: width}} className="box__container">
      <h2 className="box__h2">{value}</h2>
      <p className="box__p">{text}</p>
    </div> 
  )
}

export default Box;