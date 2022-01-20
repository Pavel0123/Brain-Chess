import React, {useState, useEffect} from "react";
import { useParams } from 'react-router-dom';
import Board from "../../components/game/Board"
import PieceCard from "../../components/game/PieceCard"
import Button from "../../components/Button";
import Input from "../../components/Input";
import { ReactComponent as WhiteKing } from "../../images/figures/White-King.svg" 
import { ReactComponent as WhiteQueen } from "../../images/figures/White-Queen.svg" 
import { ReactComponent as WhitePrince } from "../../images/figures/White-Prince.svg" 
import { ReactComponent as WhiteDragon } from "../../images/figures/White-Dragon.svg" 
import { ReactComponent as WhiteRook } from "../../images/figures/White-Rook.svg" 
import { ReactComponent as WhiteBishop } from "../../images/figures/White-Bishop.svg" 
import { ReactComponent as WhiteHorse } from "../../images/figures/White-Horse.svg" 
import { ReactComponent as WhiteGuard } from "../../images/figures/White-Guard.svg"
import { ReactComponent as WhitePawn } from "../../images/figures/White-Pawn.svg" 
import "./BoardScreen.css"
import { httpsCallable } from "firebase/functions";
import {functions, auth} from "../../firebase"
import { getDatabase, ref, child, get } from "firebase/database";
import {useNavigate} from 'react-router-dom';

export default function HomeScreen()  {
  const [field, setField] = useState(Array(64).fill(0));
  const [figure, setFigure] = useState(0);
  const [points,setPoints] = useState(0)
  const [king,setKing] = useState(0)
  const [submitCounter, setSubmitCounter] = useState(0)
  const [view, setView] = useState(0)
  const [submit, setSubmit] = useState(false)
  const [error, setError] = useState(false)

  const navigate = useNavigate();
  const { id } = useParams();

  const handleClick = (i) => {
    if((figure === 6 || figure === 0 ? 40 : 48) <= i)  {
    field[i].field === figure ? 
      field[i] = {field: 0} : field[i] = {field: figure};
    setField([...field]);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    let array = [];
    field.map((element) => {
      array.push(element.field ? element.field : 0);
    });
    push(array, event?.target[0]?.value)
  }

  useEffect(() => {
    let counter = 35;
    let king = 0;
    field.map((element) => {
      let x = element.field ? element.field : 0;
      switch(x) {
      case 1:
        king++;
      break
      case 2:
        counter = counter - 7;
      break
      case 3:
        counter = counter - 4;
      break
      case 4:
        counter = counter - 3;
      break
      case 5:
        counter = counter - 3;
      break
      case 6:
        counter = counter - 1;
      break
      case 7:
        counter = counter - 6;
      break
      case 8:
        counter = counter - 5;
      break
      case 9:
        counter = counter - 2;
      break
      default:
      }
    });
    if((king === 1 && figure === 1) || (counter < 7 && figure === 2) || (counter < 4 && figure === 3) ||
     (counter < 3 && figure === 4) || (counter < 3 && figure === 5) || (counter < 1 && figure === 6) ||
      (counter < 6 && figure === 7) || (counter < 5 && figure === 8)|| (counter < 2 && figure === 9)) {
      setFigure(0);
    }
    setKing(king)
    setPoints(counter)
  },[field]);


  const Confirm = () => {
    if(king === 1)  {
    setSubmit(true);
    setFigure(0);
    setSubmitCounter(submitCounter+1);
    }
    if(submitCounter >= 3) {
      let array = [];
    field.map((element) => {
      array.push(element.field ? element.field : 0);
    });
    push(array, "Board " + id)
    }
  }

  const card = [
      <PieceCard onClick={() => king < 1 && setFigure(1)} clicked={figure === 1 ? true : false} cost={0} value={<WhiteKing className="board__container-icon" />}></PieceCard>,
      <PieceCard onClick={() => points >= 7 && setFigure(2)} clicked={figure === 2 ? true : false} cost={7} value={<WhiteQueen className="board__container-icon" />}></PieceCard>,
      <PieceCard onClick={() => points >= 6 && setFigure(7)} clicked={figure === 7 ? true : false} cost={6} value={<WhitePrince className="board__container-icon" />}></PieceCard>,
      <PieceCard onClick={() => points >= 5 && setFigure(8)} clicked={figure === 8 ? true : false} cost={5} value={<WhiteDragon className="board__container-icon" />}></PieceCard>,
      <PieceCard onClick={() => points >= 4 && setFigure(3)} clicked={figure === 3 ? true : false} cost={4} value={<WhiteRook className="board__container-icon" />}></PieceCard>,
      <PieceCard onClick={() => points >= 3 && setFigure(4)} clicked={figure === 4 ? true : false} cost={3} value={<WhiteBishop className="board__container-icon" />}></PieceCard>,
      <PieceCard onClick={() => points >= 3 && setFigure(5)} clicked={figure === 5 ? true : false} cost={3} value={<WhiteHorse className="board__container-icon" />}></PieceCard>,
      <PieceCard onClick={() => points >= 2 && setFigure(9)} clicked={figure === 9 ? true : false} cost={2} value={<WhiteGuard className="board__container-icon" />}></PieceCard>,
      <PieceCard onClick={() => points >= 1 && setFigure(6)} clicked={figure === 6 ? true : false} cost={1} value={<WhitePawn className="board__container-icon" />}></PieceCard>
    ]

  const Cards = () => {
    return (
      <div className="board__pieceCard">
      <div className="board__card-container noselect" onClick={() => view > 0 && setView(view - 1)}><h2 className="board__card-text">{view > 0 && "<"}</h2></div>
      {card[view]}
      {card[view + 1]}
      {card[view + 2]}
      {card[view + 3]}
      <div className="board__card-container noselect" onClick={() => view < 5 && setView(view + 1)}><h2 className="board__card-text">{view < 5 && ">"}</h2></div>
  
      </div>
    )
  }

  //push deck
  async function push(board, name) {
    const addMessage = httpsCallable(functions, 'deck-addDeck');
    await addMessage({ board: board, id: id, name: name })
    .then((result) => {
      const data = result.data;
      console.log(data.status)
      if(data.status === "ok") {
        navigate("/boards")
      }
      else {
        setError(true)
        setSubmit(false)
      }
    });
  }

  //pull deck
  useEffect(() => {
    if(auth?.currentUser?.uid)  {
      const db = ref(getDatabase());
    get(child(db, "decks/"+ auth.currentUser.uid + "/" + id)).then((result) => {
      if(result?.val()?.id === id) {
        let array = [];
        result.val()?.deck.map((element) => {
          array.push({field: element});
        });
        setField(array);
      }
    });
  }
  },[auth?.currentUser?.uid]);

  return(
    <div className="board__body">
    <div className="boardScreen__container">
      <div className="board__board">
        {<Board fields={field}  onClick={handleClick} filled={figure === 6 ? 40 : 48}/>}
      </div>
      <Cards/>
      <div onClick={Confirm}>
      {!submit ?<Button width={"100%"} value={points === 0 ? king === 0 ? "Place King" : "Confirm": points + " points"} />:null}
      {submit ? <Input placeholder={"Name"} width={"356px"} onSubmit={handleSubmit}/> : null}
      </div>
      {error && <h2 className="board__h2">Invalid deck !!!</h2>}
    </div>
    </div>
    
  )
}