import React, {useState, useEffect, useRef} from "react";
import Board from "../../components/game/Board"
import { httpsCallable } from "firebase/functions";
import {functions} from "../../firebase"
import {auth} from "../../firebase"
import { getDatabase, ref, onValue, update } from "firebase/database"
import { ReactComponent as Icon4 } from "../../images/user-icon.svg" 
import { ReactComponent as Icon3 } from "../../images/flag-icon.svg" 
import { ReactComponent as Icon2 } from "../../images/handshake-icon.svg" 
import { child, get } from "firebase/database";
import Button from "../../components/Button";

import "./PlayScreen.css"
import { Navigate, useNavigate } from "react-router";

export default function PlayScreen()  {
  const [field, setField] = useState(Array(64).fill(0));

  const [playerTurn, setPlayerTurn] = useState(true);
  const [playerColor,setPlayerColor] = useState(true);

  const [firstField, setFirstField] = useState(null);
  const [secondField, setSecondField] = useState(null);
  const [game, setGame] = useState(null);
  const [deck, setDeck] = useState([]);
  const [turns, setTurns] = useState([]);

  const [playerWhiteTime, setPlayerWhiteTime] = useState(null);
  const [playerBlackTime, setPlayerBlackTime] = useState(null);
  const [playerWhiteRating, setPlayerWhiteRating] = useState(null);
  const [playerBlackRating, setPlayerBlackRating] = useState(null);
  const [playerWhite, setPlayerWhite] = useState(null);
  const [playerBlack, setPlayerBlack] = useState(null);
  const [winner, setWinner] = useState(null);
  const [showWinner, setShowWinner] = useState(null);
  const [surrend, setSurrend] = useState(null);
  const [drawed, setDrawed] = useState(null);
  
  const [counter, setCounter] = useState(0);
  const [turnsCounter, setTurnsCounter] = useState(0);

  const navigate = useNavigate();
  const db = getDatabase()
  const countRef = useRef(null);

  const handleClick = (i) => {
    if(counter !== turnsCounter)  {
      setCounter(turnsCounter);
      return;
    } 
    if(playerTurn)  {
      firstField === null ? setFirstField(i) : setSecondField(i);
    }
  }

  const handleCounter = (i) => {
    if(counter + i <= turnsCounter && counter + i >= 0){
      setFirstField(null);
      setSecondField(null);
      setCounter(counter + i)
    }
  }



  useEffect(() => {
    field[firstField] = {field:field[firstField]?.field ,selected: true}
    setField([...field]);
    setSecondField(null)
  },[firstField]);

  useEffect(() => {
    field[firstField] = {field:field[firstField]?.field ,selected: false};
    setField([...field]);
    if(firstField !== secondField) {
      playerResponse();
    }
    setFirstField(null)

  },[secondField]);

  //manage time

  useEffect(() => {
    countRef.current = setInterval(() => { 
      if(!winner)  {
      if(playerColor) {
        if(playerTurn) {
            setPlayerWhiteTime((playerWhiteTime) => playerWhiteTime-1)
          } else  {
            setPlayerBlackTime((playerBlackTime) => playerBlackTime-1)
          }
      }
      else{
        if(playerTurn) {
            setPlayerBlackTime((playerBlackTime) => playerBlackTime-1)
          } else {
            setPlayerWhiteTime((playerWhiteTime) => playerWhiteTime-1)
          }
      }     
  }
    }, 1000);
    return () => {
      clearInterval(countRef.current);
    };
  },[playerColor, playerTurn, winner]);


  useEffect(() => {
    if((playerBlackTime < 0 || playerWhiteTime < 0) && !winner)  {
      const time = httpsCallable(functions, 'play-time');
      time()
      .then((result) => {
        const data = result.data;
        console.log(data.status)
    });
    }

  },[playerBlackTime, playerWhiteTime]);


  function time(time) {
    const min = Math.floor(time / 60);
    const seconds = time % 60;
    if(min < 0 || seconds < 0)  {
      return "0:00"
    }
    return min + ":" + (seconds < 10 ? "0" +seconds : seconds)
  }

  // rollback turns

  useEffect(() => {
    const db = ref(getDatabase());
    async function run()  {
        let count = 0;
        let turn = [];

        for ( const key in turns ) {
          if(count < counter) {
          turn.push(turns[key]);
          }
          count++;
        }
        if(deck && turn) {
          renderMoves(turn, deck); 
        }

    }
    run();
  },[counter]);

  function renderMoves(data,deck)  {
    let array1 = [];
    let from;
    let to;
    deck.map((element) => {
      array1.push({field: element});
    });     

    for ( const key in data ) {
      from = data[key].from;
      to = data[key].to;
      
      array1 = playMove(array1, from, to); 
    }
    if(from && to)  {
      array1[from] = {field: array1[from].field, last: true}
      array1[to] = {field: array1[to].field, last: true}
    }

    if(playerColor) {
      array1.reverse();
    }
    setField(array1);
  }


  //sending to server
  
  function playerResponse() {
    if(playerColor){
      push(63 -firstField,63 -secondField)
    }
    else  {
      push(firstField,secondField)
    }
  }

  async function push(from, to) {
    const playTurn = httpsCallable(functions, 'play-playTurn');
    await playTurn({ from: from, to: to, game: game })
    .then((result) => {
      const data = result.data;
      console.log(data.status)
    });
  }

  //receice from server

  async function receive(game, color)  {

    await onValue(ref(db,"game/"+ game + "/"), async (result) => {
      const data = result?.val()?.turns ? result?.val()?.turns : [];
      let array = result.val()?.deck;
      let counter = 0;
  
      const draw = result?.val()?.drawWhite || result?.val()?.drawBlack;

      if(!array)  {
        end();
        return;
      }

      setDeck(array);
      setTurns(data);
      setPlayerWhiteTime(result?.val()?.timeWhite)
      setPlayerBlackTime(result?.val()?.timeBlack)    
 
      for ( const key in data ) {
        counter++; 
      }


      if(draw) {
        setDrawed(true)
      } else {
        setDrawed(false)
      }

      setCounter(counter);
      setTurnsCounter(counter)

      if(counter%2 === 0) {
        setPlayerTurn(color);
      } else {
        setPlayerTurn(!color);
      }
    
    });
  }


  function playMove(array1, from, to) {
    if(array1[from].field === 6 && to >= 56)  {
      array1[to] = {field:2 ,selected: false}
      array1[from] = {field:0 ,selected: false};
      return array1;
    }

    if(array1[from].field === 16 && to <= 7)  {
      array1[to] = {field:12 ,selected: false}
      array1[from] = {field:0 ,selected: false};
      return array1;
    }

    array1[to] = {field:array1[from]?.field ,selected: false}
    array1[from] = {field:0 ,selected: false};
    return array1
  }

  //surender 

  const surender = () => {
    const surender = httpsCallable(functions, 'play-surender');
    surender()
    .then((result) => {
      const data = result.data;
      console.log(data.status)
    });
  } 

  //draw

  const draw = () => {
    const draw = httpsCallable(functions, 'play-draw');
    draw()
    .then((result) => {
      const data = result.data;
      console.log(data.status)
    });
  } 

  const drawDecline = () => {
    setDrawed(false);
    const draw = httpsCallable(functions, 'play-drawDecline');
    draw()
    .then((result) => {
      const data = result.data;
      console.log(data.status)
    });
  } 
  

  //  game start

  useEffect(() => {
    if(auth?.currentUser?.uid)  {
    getDeck();
    }
    auth.onAuthStateChanged(() => {
      if(auth?.currentUser?.uid)  {
        getDeck();
      }
    });
  },[]);


  async function getDeck()  {
    const db = ref(getDatabase());
    let black;
    let white;
    let game;

    await get(child(db, "users/"+ auth.currentUser.uid + "/")).then((result) => {
      game = result?.val()?.game;
      setGame(game)
    });

    await get(child(db, "game/"+ game + "/")).then((result) => {
      if(result.val()?.deck) {
      let array = [];
      result.val().deck.map((element) => {
        array.push({field: element});
      });
      white = result.val().playerWhite;
      black = result.val().playerBlack;
      let color = true;

      if(result.val().playerWhite === auth.currentUser.uid) { 
        array.reverse();
        setField(...[array]);
      }
      else {
        setPlayerColor(!playerColor)
        color = false;
        setField(...[array]);
      }
      receive(game, color);
    }
    });

    await get(child(db, "users/"+ white + "/")).then((result) => {
      setPlayerWhite(result?.val()?.name);
      setPlayerWhiteRating(result?.val()?.rating);
    });

    await get(child(db, "users/"+ black + "/")).then((result) => {
      setPlayerBlack(result?.val()?.name);
      setPlayerBlackRating(result?.val()?.rating);
    });
  }

  // after game end 
  
  async function end()  {
    const db = ref(getDatabase());
    setPlayerTurn(false);
    let game;

    await get(child(db, "users/"+ auth.currentUser.uid + "/")).then((result) => {
      game = result?.val()?.game;
      setGame(game)
    });


    await get(child(db, "archived/"+ game + "/")).then((result) => {
      setWinner(result?.val()?.winner);
      setShowWinner(true)
      console.log(result?.val()?.winner)
      return;
    });
  }

  //components 

  const returnHome = () => {
    navigate("/queue");
  }

  const OptionCard = ({onClick,value, className}) => {
    return(
    <div onClick={onClick} className={className}>
    <h2 className="playScreen__option-h2">{value}</h2>
    </div>
    )
  }

  const Menu = () => {
    return(
    <div className="playScreen__option">
      <OptionCard onClick={() =>handleCounter(-1)} className={"playScreen__option-small-left"} value={"<"}/>
      <OptionCard onClick={() =>setSurrend(true)} className={"playScreen__option-big"} value={<Icon3 className="playScreen__icon-big"/>}/>
      <OptionCard onClick={() =>setDrawed(true)} className={"playScreen__option-big"} value={<Icon2 className="playScreen__icon-big"/>}/>
      <OptionCard onClick={() =>handleCounter(+1)} className={"playScreen__option-small-right"} value={">"}/>
    </div>
    )
  }

  const Return = () => {
    return(
    <div className="playScreen__option">
      <OptionCard onClick={() =>handleCounter(-1)} className={"playScreen__option-small-left"} value={"<"}/>
      <div className="playScreen__option-biggest" onClick={returnHome}>
        <h2 className="playScreen__option-h3">Return</h2>
      </div>
      <OptionCard onClick={() =>handleCounter(+1)} className={"playScreen__option-small-right"} value={">"}/>
    </div>
    )
  }

  const MenuSurrend = () => {
    return(
    <div className="playScreen__option">
      <div className="playScreen__option-big-left" onClick={surender}>
        <h2 className="playScreen__option-h3">Surrender</h2>
      </div>
      <div className="playScreen__option-big-right" onClick={() => setSurrend(false)}>
        <h2 className="playScreen__option-h3">Cancel</h2>
      </div>
    </div>
    )
  }


  const MenuDraw = () => {
    return(
    <div className="playScreen__option">
      <div className="playScreen__option-big-left" onClick={draw}>
        <h2 className="playScreen__option-h3">Draw</h2>
      </div>
      <div className="playScreen__option-big-right" onClick={drawDecline}>
        <h2 className="playScreen__option-h3">Decline</h2>
      </div>
    </div>
    )
  }

  function material(player) {
    let material = 0;
    field.map((element) => {
      let x = element.field;
      switch(x) {
      case 2:
        material+=7;
      break
      case 3:
        material+=4;
      break
      case 4:
        material+=3;
      break
      case 5:
        material+=3;
      break
      case 6:
        material+=1;
      break
      case 7:
        material+=6;
      break
      case 8:
        material+=5;
      break
      case 9:
        material+=2;
      break
      case 12:
        material-=7;
      break
      case 13:
        material-=4;
      break
      case 14:
        material-=3;
      break
      case 15:
        material-=3;
      break
      case 16:
        material-=1;
      break
      case 17:
        material-=6;
      break
      case 18:
        material-=5;
      break
      case 19:
        material-=2;
      break
      default:
      }
    });
    if(!player) {
      material = material * -1;
    }
    return(material)
  }

  return(
    <div className="playScreen__body">
      {showWinner?<div onClick={() => setShowWinner(false)} className="playScreen__win-navbar"><h1>{winner === "draw" ? "draw" : winner + " won"}</h1></div> : null}
      {showWinner ? <div onClick={() => setShowWinner(false)} className="playScreen__win-box"><h2 className="playScreen__win-h2" >New Rating</h2><h3 className="playScreen__win-h2" >
        {playerColor ? playerWhiteRating: playerBlackRating} {(playerColor && winner === "white") || (!playerColor && winner === "black") ? "+": "-"} {winner === "draw" ? 0 : 10}</h3></div> : null}
    <div className="playScreen__container">
    <div className="playScreen__play-container">
      <div className="playScreen__player-time" >      
        <h2 className="playScreen__h2 playScreen__player-margin">{material(!playerColor) > 0 ? ("+" + material(!playerColor)) : null}</h2>
        <h2 style={!playerTurn && !winner ? {background:"dimgrey" } : null} className="playScreen__h2 playScreen__player-border">{!playerColor? time(playerWhiteTime) : time(playerBlackTime)}</h2>
      </div>
      <div className="playScreen__player-box">
        <h2 className="playScreen__h2" ><Icon4 className="playScreen__player-icon"/>{!playerColor? playerWhite : playerBlack}</h2>
        <h2 className="playScreen__h2">( {!playerColor? playerWhiteRating : playerBlackRating} )</h2>
      </div>
      <div className="playScreen__board">
        {<Board fields={field} onClick={handleClick} />}
      </div>
      <div className="playScreen__player-box">
        <h2 className="playScreen__h2"><Icon4 className="playScreen__player-icon"/>{playerColor? playerWhite : playerBlack}</h2>
        <h2 className="playScreen__h2">( {playerColor? playerWhiteRating : playerBlackRating} )</h2>
      </div>
      <div className="playScreen__player-time" >      
        <h2 className="playScreen__h2 playScreen__player-margin">{material(playerColor) > 0 ? ("+" + material(playerColor)) : null}</h2>
        <h2 style={playerTurn && !winner ? {background:"dimgrey" } : null} className="playScreen__h2 playScreen__player-border">{playerColor? time(playerWhiteTime) : time(playerBlackTime)}</h2>
      </div>
      </div>
      {winner? 
        <Return/>
      :
      <div >
        {surrend || drawed ? surrend ? <MenuSurrend/> : <MenuDraw/> : <Menu/>}
      </div>
      }
    </div>
    </div>
    
  )
}