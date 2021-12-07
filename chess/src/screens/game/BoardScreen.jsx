import React, {useState, useEffect} from "react";
import { useParams } from 'react-router-dom';
import Board from "../../components/game/Board"
import PieceCard from "../../components/game/PieceCard"
import Button from "../../components/Button";
import Input from "../../components/Input";
import { ReactComponent as WhiteKing } from "../../images/figures/White-King.svg" 
import { ReactComponent as WhiteQueen } from "../../images/figures/White-Queen.svg" 
import { ReactComponent as WhiteRook } from "../../images/figures/White-Rook.svg" 
import { ReactComponent as WhiteBishop } from "../../images/figures/White-Bishop.svg" 
import { ReactComponent as WhiteHorse } from "../../images/figures/White-Horse.svg" 
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
  const [submit, setSubmit] = useState(false)
  const [error, setError] = useState(false)

  const navigate = useNavigate();
  const { id } = useParams();

  const handleClick = (i) => {
    field[i].field === figure ? 
      field[i] = {field: 0} : field[i] = {field: figure};
    setField([...field]);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    let array = [];
    field.map((element) => {
      array.push(element.field ? element.field : 0);
    });
    push(array, event.target[0].value)
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
      default:
      }
    });
    if(king === 1 && figure === 1) {
      setFigure(0);
    }
    setKing(king)
    setPoints(counter)
  },[field]);


  const Confirm = () => {
    setSubmit(true);
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
    <div className="board__container">
      <div className="board__board">
        {<Board fields={field}  onClick={handleClick} filled={figure === 6 ? 40 : 48}/>}
      </div>
      <div className="board__pieceCard">
      <PieceCard onClick={() => king < 1 && setFigure(1)} clicked={figure === 1 ? true : false} cost={0} value={<WhiteKing className="board__container-icon" />}></PieceCard>
      <PieceCard onClick={() => setFigure(2)} clicked={figure === 2 ? true : false} cost={7} value={<WhiteQueen className="board__container-icon" />}></PieceCard>
      <PieceCard onClick={() => setFigure(3)} clicked={figure === 3 ? true : false} cost={4} value={<WhiteRook className="board__container-icon" />}></PieceCard>
      <PieceCard onClick={() => setFigure(4)} clicked={figure === 4 ? true : false} cost={3} value={<WhiteBishop className="board__container-icon" />}></PieceCard>
      <PieceCard onClick={() => setFigure(5)} clicked={figure === 5 ? true : false} cost={3} value={<WhiteHorse className="board__container-icon" />}></PieceCard>
      <PieceCard onClick={() => setFigure(6)} clicked={figure === 6 ? true : false} cost={1} value={<WhitePawn className="board__container-icon" />}></PieceCard>
      </div>

      <div onClick={Confirm}>
      {!submit ?<Button width={"100%"} value={points === 0 ? "Confirm": points + " points"} />:null}
      {submit ? <Input width={"356px"} onSubmit={handleSubmit}/> : null}
      </div>
      {error && <h2 className="board__h2">Invalid deck !!!</h2>}
    </div>
    </div>
    
  )
}