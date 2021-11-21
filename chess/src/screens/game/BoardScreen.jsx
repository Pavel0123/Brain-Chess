import React, {useState} from "react";
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
  const [figure, setFigure] = useState(0)

  const handleClick = (i) => {
    field[i] = {field: figure};
    setField([...field]);
  }

  const Confirm = () => {
    let array = [];
    field.map((element) => {
      array.push(element.field ? element.field : 0);
    });
    console.log(array);
  }

  return(
    <div className="board__body">
    <div className="board__container">
      <div className="board__board">
        {<Board fields={field}  onClick={handleClick} />}
      </div>
      <div className="board__pieceCard">
      <div onClick={() => setFigure(1)}>
      <PieceCard cost={0} value={<WhiteKing className="board__container-icon" />}></PieceCard>
      </div>
      <div onClick={() => setFigure(2)}>
      <PieceCard cost={7} value={<WhiteQueen className="board__container-icon" />}></PieceCard>
      </div>
      <div onClick={() => setFigure(3)}>
      <PieceCard cost={5} value={<WhiteRook className="board__container-icon" />}></PieceCard>
      </div>
      <div onClick={() => setFigure(4)}>
      <PieceCard cost={3} value={<WhiteBishop className="board__container-icon" />}></PieceCard>
      </div>
      <div onClick={() => setFigure(5)}>
      <PieceCard cost={3} value={<WhiteHorse className="board__container-icon" />}></PieceCard>
      </div>
      <div onClick={() => setFigure(6)}>
      <PieceCard cost={1} value={<WhitePawn className="board__container-icon" />}></PieceCard>
      </div>
      </div>

      <div onClick={Confirm}>
      <Button width={"100%"} value={"Confirm"} />
      </div>
    </div>
    </div>
    
  )
}