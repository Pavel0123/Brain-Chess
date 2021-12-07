import React from "react";
import Field from "./Field";
import "./Board.css"


const Board = ({ fields, onClick, filled}) => (
  <div className="board__container">
    {fields.map(( {field, selected, last}, i ) => (
      filled > i || last ? 
      <Field key={i} color={(i + Math.ceil((i+1)/8)) % 2 === 1 ? "white-filled" : "black-filled" } value={field} selected={selected} onClick={() => onClick(i)} />
      :
      <Field key={i} color={(i + Math.ceil((i+1)/8)) % 2 === 1 ? "white" : "black" } value={field} selected={selected} onClick={() => onClick(i)} />
    ))}
  </div>
);
export default Board;

