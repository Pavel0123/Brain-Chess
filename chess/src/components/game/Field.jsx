import React from "react";
import "./Field.css"


const Field = ({color, value, onClick }) => {
  const style = `field__container field__container-${color}` ;

  return (
    <button className={style} onClick={onClick}>
      <p>{value}</p> 
    </button>
  );
};

export default Field;