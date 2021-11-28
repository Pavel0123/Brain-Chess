import React, {useState, useEffect} from "react";
import Board from "../../components/game/Board"
import { httpsCallable } from "firebase/functions";
import {functions} from "../../firebase"
import {auth} from "../../firebase"
import { getDatabase, ref, onValue, update } from "firebase/database"
import { child, get } from "firebase/database";
import "./PlayScreen.css"

export default function PlayScreen()  {
  const [field, setField] = useState(Array(64).fill(0));

  const [playerTurn, setPlayerTurn] = useState(true);
  const [playerColor,setPlayerColor] = useState(true);

  const [firstField, setFirstField] = useState(null);
  const [secondField, setSecondField] = useState(null);
  const [game, setGame] = useState(null);
  
  const db = getDatabase()

//---------- testing const
  const shandleClick = (i) => {
    field[i] = {field: 2};
    setField([...field]);
    console.log(field)
  }

  const reverseBoard = () => {
    if(playerColor) {
    setPlayerColor(!playerColor)
    field.reverse();
    setField([...field]);
  }
  }
  const changeTurn = () => {
    setPlayerTurn(!playerTurn)
  }

//-----------

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
      const data = result.val().turns ;
      let array = result.val().deck;
      let array1 = [];
      let counter = 0;

      array.map((element) => {
        array1.push({field: element});
      });     
 
      if(array1) {
      for ( const key in data ) {
        let from = data[key].from;
        let to = data[key].to;
        
        counter++; 
        array1[to] = {field:array1[from]?.field ,selected: false}
        array1[from] = {field:0 ,selected: false};
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
  

//setup board

  useEffect(() => {
    if(auth?.currentUser?.uid)  {
    getDeck();
    }
  },[auth?.currentUser?.uid]);

  async function getDeck()  {
    const db = ref(getDatabase());
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
  }




  return(
    <div className="playScreen__body">
    <div className="playScreen__container">
      <div className="playScreen__board">
        {<Board fields={field} onClick={handleClick} />}
      </div>
      <button onClick={reverseBoard}>reverse</button>
      <button onClick={changeTurn}>changeTurn</button>
      <p>{playerColor? "white" : "black"}</p>
    </div>
    </div>
    
  )
}