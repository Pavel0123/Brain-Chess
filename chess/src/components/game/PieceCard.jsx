import React from "react";
import "./PieceCard.css"

const PieceCard = ({ value, cost, onClick }) => {
  
  return( 
<div onClick={onClick} className="pieceCard__container">
  {value}
  <div className="pieceCard__card">
    <h2>{cost}</h2>
  </div>
</div>)
};
export default PieceCard;
