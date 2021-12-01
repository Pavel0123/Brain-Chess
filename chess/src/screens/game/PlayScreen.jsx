import React, {useState, useEffect, useRef} from "react";
import Board from "../../components/game/Board"
import { httpsCallable } from "firebase/functions";
import {functions} from "../../firebase"
import {auth} from "../../firebase"
import { getDatabase, ref, onValue, update } from "firebase/database"
import { ReactComponent as Icon4 } from "../../images/user-icon.svg" 
import { child, get } from "firebase/database";
import Button from "../../components/Button";

import "./PlayScreen.css"

export default function PlayScreen()  {
  const [field, setField] = useState(Array(64).fill(0));

  const [playerTurn, setPlayerTurn] = useState(true);
  const [playerColor,setPlayerColor] = useState(true);

  const [firstField, setFirstField] = useState(null);
  const [secondField, setSecondField] = useState(null);
  const [game, setGame] = useState(null);

  const [playerWhiteTime, setPlayerWhiteTime] = useState(null);
  const [playerBlackTime, setPlayerBlackTime] = useState(null);
  const [playerWhiteRating, setPlayerWhiteRating] = useState(null);
  const [playerBlackRating, setPlayerBlackRating] = useState(null);
  const [playerWhite, setPlayerWhite] = useState(null);
  const [playerBlack, setPlayerBlack] = useState(null);
  const [winner, setWinner] = useState(null);
  const [showWinner, setShowWinner] = useState(null);

  
  const db = getDatabase()
  const countRef = useRef(null);

  const handleClick = (i) => {
    if(playerTurn) firstField === null ? setFirstField(i) : setSecondField(i);
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
    return min + ":" + seconds
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
      let array1 = [];
      let counter = 0;

      if(!array)  {
        end();
        return;
      }

      setPlayerWhiteTime(result?.val()?.timeWhite)
      setPlayerBlackTime(result?.val()?.timeBlack)

      array.map((element) => {
        array1.push({field: element});
      });     
 
      if(array1) {
      for ( const key in data ) {
        let from = data[key].from;
        let to = data[key].to;

        array1 = playMove(array1, from, to); 
        counter++; 
      }
      if(color) {
        array1.reverse();
      }
      setField([...array1]);

      if(counter%2 === 0) {
        setPlayerTurn(color);
      } else {
        setPlayerTurn(!color);
      }
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


  return(
    <div className="playScreen__body">
      {showWinner?<div onClick={() => setShowWinner(false)} className="playScreen__win-navbar"><h1>{winner} won</h1></div> : null}
      {showWinner ? <div onClick={() => setShowWinner(false)} className="playScreen__win-box"><h2 className="playScreen__win-h2" >New Rating</h2><h3 className="playScreen__win-h2" >
        {playerColor ? playerWhiteRating: playerBlackRating} {(playerColor && winner === "white") || (!playerColor && winner === "black") ? "+": "-"} 10</h3></div> : null}
    <div className="playScreen__container">
    <div className="playScreen__play-container">
    <h2>( {!playerColor? playerWhiteRating : playerBlackRating} )</h2>
      <div className="playScreen__player-box">
        <h2 className="playScreen__h2" ><Icon4 className="playScreen__player-icon"/>{!playerColor? playerWhite : playerBlack}</h2>
        <h2 className="playScreen__h2">{!playerColor? time(playerWhiteTime) : time(playerBlackTime)}</h2>
    </div>
      <div className="playScreen__board">
        {<Board fields={field} onClick={handleClick} />}
      </div>
      <div className="playScreen__player-box">
        <h2 className="playScreen__h2"><Icon4 className="playScreen__player-icon"/>{playerColor? playerWhite : playerBlack}</h2>
        <h2 className="playScreen__h2">{playerColor? time(playerWhiteTime) : time(playerBlackTime)}</h2>
      </div>
      <h2>( {playerColor? playerWhiteRating : playerBlackRating} )</h2>
      </div>
      <div className="playScreen__surender" onClick={surender}>
      <Button value={"Surrender"} width={"100%"}/>
      </div>
    </div>

    </div>
    
  )
}