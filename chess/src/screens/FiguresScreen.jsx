import React, {useState, useEffect} from "react";
import Board from "../components/game/Board"
import PieceCard from "../components/game/PieceCard"
import Button from "../components/Button";
import Input from "../components/Input";
import Pieces from "../functions/Pieces.jsx";
import { ReactComponent as WhiteKing } from "../images/figures/White-King.svg" 
import { ReactComponent as WhiteQueen } from "../images/figures/White-Queen.svg" 
import { ReactComponent as WhitePrince } from "../images/figures/White-Prince.svg" 
import { ReactComponent as WhiteDragon } from "../images/figures/White-Dragon.svg" 
import { ReactComponent as WhiteRook } from "../images/figures/White-Rook.svg" 
import { ReactComponent as WhiteBishop } from "../images/figures/White-Bishop.svg" 
import { ReactComponent as WhiteHorse } from "../images/figures/White-Horse.svg" 
import { ReactComponent as WhiteGuard } from "../images/figures/White-Guard.svg"
import { ReactComponent as WhitePawn } from "../images/figures/White-Pawn.svg" 
import "./FiguresScreen.css"

export default function HomeScreen()  {
  const [field, setField] = useState(Array(64).fill(0));
  const [header, setHeader] = useState("");
  const [text, setText] = useState("");

  const [figure, setFigure] = useState(1);
  const [view, setView] = useState(0)




  useEffect(() => {
    const result = Pieces(figure);
    setHeader(result.figure)
    setText(result.text)
    setField(result.board);
  },[figure]);


  const card = [
      <PieceCard onClick={() => setFigure(1)} clicked={figure === 1 ? true : false} cost={0} value={<WhiteKing className="board__container-icon" />}></PieceCard>,
      <PieceCard onClick={() => setFigure(2)} clicked={figure === 2 ? true : false} cost={7} value={<WhiteQueen className="board__container-icon" />}></PieceCard>,
      <PieceCard onClick={() => setFigure(7)} clicked={figure === 7 ? true : false} cost={6} value={<WhitePrince className="board__container-icon" />}></PieceCard>,
      <PieceCard onClick={() => setFigure(8)} clicked={figure === 8 ? true : false} cost={5} value={<WhiteDragon className="board__container-icon" />}></PieceCard>,
      <PieceCard onClick={() => setFigure(3)} clicked={figure === 3 ? true : false} cost={4} value={<WhiteRook className="board__container-icon" />}></PieceCard>,
      <PieceCard onClick={() => setFigure(4)} clicked={figure === 4 ? true : false} cost={3} value={<WhiteBishop className="board__container-icon" />}></PieceCard>,
      <PieceCard onClick={() => setFigure(5)} clicked={figure === 5 ? true : false} cost={3} value={<WhiteHorse className="board__container-icon" />}></PieceCard>,
      <PieceCard onClick={() => setFigure(9)} clicked={figure === 9 ? true : false} cost={2} value={<WhiteGuard className="board__container-icon" />}></PieceCard>,
      <PieceCard onClick={() => setFigure(6)} clicked={figure === 6 ? true : false} cost={1} value={<WhitePawn className="board__container-icon" />}></PieceCard>
    ]

  const Cards = () => {
    return (
      <div className="figureScreen__pieceCard">
      <div className="figureScreen__card-container" onClick={() => view > 0 && setView(view - 1)}><h2 className="board__card-text">{view > 0 && "<"}</h2></div>
      {card[view]}
      {card[view + 1]}
      {card[view + 2]}
      {card[view + 3]}
      <div className="figureScreen__card-container" onClick={() => view < 5 && setView(view + 1)}><h2 className="board__card-text">{view < 5 && ">"}</h2></div>
  
      </div>
    )
  }


  return(
    <div className="figureScreen__body">
    <div className="figureScreen__container">
      <div className="figureScreen__board-container">
        <div className="figureScreen__board">
          {<Board fields={field}  onClick={() => null} />}
        </div>
      </div>
      <Cards/>
      <div className="figureScreen__box">
        <h2 className="figureScreen__h2" >{header}</h2>
        <p className="figureScreen__p" >{text}</p>
      </div>
    </div>
    </div>
    
  )
}