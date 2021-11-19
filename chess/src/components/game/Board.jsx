import React from "react";
import Field from "./Field";


const Board = ({ fields, onClick }) => (
  <div className="board">
    {fields.map((field, i = 1) => (
      <Field key={i} color={(i + Math.ceil((i+1)/8)) % 2 === 1 ? "white" : "black" } value={field} onClick={() => onClick(i)} />
    ))}
  </div>
);
export default Board;

