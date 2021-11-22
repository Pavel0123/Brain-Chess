import React, {useState} from "react";
import { useParams } from 'react-router-dom';
import Board from "../../components/game/Board"
import PieceCard from "../../components/game/PieceCard"
import Button from "../../components/Button";
import { ReactComponent as WhiteKing } from "../../images/figures/White-King.svg" 
import { ReactComponent as WhiteQueen } from "../../images/figures/White-Queen.svg" 
import { ReactComponent as WhiteRook } from "../../images/figures/White-Rook.svg" 
import { ReactComponent as WhiteBishop } from "../../images/figures/White-Bishop.svg" 
import { ReactComponent as WhiteHorse } from "../../images/figures/White-Horse.svg" 
import { ReactComponent as WhitePawn } from "../../images/figures/White-Pawn.svg" 
import "./BoardScreen.css"

export default function HomeScreen()  {
  const [field, setField] = useState(Array(64).fill(0));
  const [figure, setFigure] = useState(0);
  const { id } = useParams();

  const handleClick = (i) => {
    field[i].field === figure ? 
      field[i] = {field: 0} : field[i] = {field: figure};
    setField([...field]);
  }

  const Confirm = () => {
    let array = [];
    field.map((element) => {
      array.push(element.field ? element.field : 0);
    });
    console.log(array);
    console.log(id)
  }

  return(
    <div className="board__body">
    <div className="board__container">
      <div className="board__board">
        {<Board fields={field}  onClick={handleClick} />}
      </div>
      <div className="board__pieceCard">
      <PieceCard onClick={() => setFigure(1)} cost={0} value={<WhiteKing className="board__container-icon" />}></PieceCard>
      <PieceCard onClick={() => setFigure(2)} cost={7} value={<WhiteQueen className="board__container-icon" />}></PieceCard>
      <PieceCard onClick={() => setFigure(3)} cost={5} value={<WhiteRook className="board__container-icon" />}></PieceCard>
      <PieceCard onClick={() => setFigure(4)} cost={3} value={<WhiteBishop className="board__container-icon" />}></PieceCard>
      <PieceCard onClick={() => setFigure(5)} cost={3} value={<WhiteHorse className="board__container-icon" />}></PieceCard>
      <PieceCard onClick={() => setFigure(6)} cost={1} value={<WhitePawn className="board__container-icon" />}></PieceCard>
      </div>

      <div onClick={Confirm}>
      <Button width={"100%"} value={"Confirm"} />
      </div>
    </div>
    </div>
    
  )
}