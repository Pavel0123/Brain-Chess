import React, {useState, useEffect} from "react";
import Board from "../../components/game/Board"
import { httpsCallable } from "firebase/functions";
import {functions} from "../../firebase"
import {auth} from "../../firebase"
import { getDatabase, ref, onValue, update } from "firebase/database"
import { child, get } from "firebase/database";
import "./PlayScreen.css"

export default function HomeScreen()  {
  const [field, setField] = useState(Array(64).fill(0));
  const [playerTurn, setPlayerTurn] = useState(true);
  const [playerColor,setPlayerColor] = useState(true);
  const [firstField, setFirstField] = useState(null);
  const [secondField, setSecondField] = useState(null);
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
      serverResponse(firstField,secondField, playerColor)
    }
    else  {
      serverResponse(63 -firstField,63 -secondField)
    }
  }

  //receice from server
  function serverResponse(first , second) {
    console.log(first+"ddd"+second)
    if(!playerColor) {
      first = 63 - first;
      second = 63 - second ;
    }
    field[second] = {field:field[first]?.field ,selected: false}
    field[first] = {field:0 ,selected: false};
    setField([...field]);
    setPlayerTurn(!playerTurn);
  }


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
    });

    await get(child(db, "game/"+ game + "/")).then((result) => {
      if(result.val()?.deck) {
      let array = [];
      result.val().deck.map((element) => {
        array.push({field: element});
      });

      if(result.val().playerWhite === auth.currentUser.uid) { 
        setPlayerColor(!playerColor)
        array.reverse();
        setField(array);
      }
      else {
        setPlayerTurn(!playerTurn)
        setField(array);
      }
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