import React from "react";
import "./BoardCard.css"
//import { ReactComponent as Icon1 } from "../images/board-icon.svg" 

const PieceCard = ({icon, value, onClick }) => {
  
  return( 
<div onClick={onClick} className="boardCard__container">
  {icon}
  <div className="boardCard__card">
  <h2 className="boardCard__h2">{value}</h2>
  </div>
</div>)
};
export default PieceCard;
