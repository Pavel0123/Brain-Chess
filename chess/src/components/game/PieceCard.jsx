import React ,{useState}from "react";
import "./PieceCard.css"

const PieceCard = ({ value, cost, onClick, clicked }) => {

  return( 
  <div onClick={onClick} className="pieceCard__container" style={clicked ?{backgroundColor: "black", borderRadius: "5px"}: null}>
  {value}
  <div className="pieceCard__card" style={clicked ? {backgroundColor: "black", borderRadius: "5px"}: null}>
    <h2>{cost}</h2>
  </div>
</div>
)
};
export default PieceCard;
