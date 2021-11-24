import React, {useState} from "react";
import "./QueueScreen.css"
import {useNavigate} from 'react-router-dom';
import Button from "../../components/Button";
import { httpsCallable } from "firebase/functions";
import {functions} from "../../firebase"
import {auth} from "../../firebase"
import { getDatabase, ref, onValue, update } from "firebase/database"

export default function HomeScreen()  {
  const [type, setType] = useState(null);
  const [deck, setDeck] = useState(null);
  const db = getDatabase()
  const navigate = useNavigate();

  function handleClick() {
    push();
  }

  onValue(ref(db, '/game/'), (result) => {
    const data = result.val() ;
    // ...
    for ( const key in data ) {
      if (auth.currentUser.uid === data[key].playerBlack || auth.currentUser.uid === data[key].playerWhite ) {
        addToGame(key)
      } 
    }
  });

  async function addToGame(game) {
    await update(ref(db, "users/"+ auth?.currentUser?.uid), {
        game: game
    });
    navigate("/play")
  
  }
    //push deck
    async function push() {
      const addQueue = httpsCallable(functions, 'add-addQueue');
      await addQueue({ board: deck, type: type })
      .then((result) => {
        const data = result.data;
        console.log(data.status)
      });
    }

  return(
    <div>    
    <div className="queueScreen__body">
    <div className="queueScreen__container">

    <h2 >Game Time</h2>
    <div className="queueScreen__box">
      <div onClick={() => setType("3 min")} className="queueScreen__button">
       <Button value={"3 min"} width={"150px"}/>
      </div>
      <div onClick={() => setType("10 min")} className="queueScreen__button">
       <Button value={"10 min"} width={"150px"}/>
      </div>
    </div>

    <h2 >Decks</h2>
    <div className="queueScreen__box">
      <div onClick={() => setDeck(1)} className="queueScreen__button">
       <Button value={"Empty"} width={"150px"}/>
      </div>
      <div onClick={() => setDeck(2)} className="queueScreen__button">
       <Button value={"Empty"} width={"150px"}/>
      </div>
    </div>
    <div className="queueScreen__box">
      <div onClick={() => setDeck(3)} className="queueScreen__button">
       <Button value={"Empty"} width={"150px"}/>
      </div>
      <div onClick={() => setDeck(4)} className="queueScreen__button">
       <Button value={"Empty"} width={"150px"}/>
      </div>
    </div>

    <div onClick={() => handleClick()} className="queueScreen__buttonLarge">
       <Button value={"Start Game"} width={"320px"}/>
      </div>
    </div>
    </div>
    </div>

  )
}