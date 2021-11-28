import React, {useState, useEffect} from "react";
import "./QueueScreen.css"
import {useNavigate} from 'react-router-dom';
import Button from "../../components/Button";
import { httpsCallable } from "firebase/functions";
import {functions} from "../../firebase"
import {auth} from "../../firebase"
import { getDatabase, ref, onValue, update } from "firebase/database"
import { child, get } from "firebase/database";

export default function HomeScreen()  {
  const [type, setType] = useState(null);
  const [deck, setDeck] = useState(null);
  const db = getDatabase()
  const navigate = useNavigate();

  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [name3, setName3] = useState("");
  const [name4, setName4] = useState("");

  function handleClick() {
    push();
  }

  useEffect(() => {
    get(ref(db, '/game/'), (result) => {
      const data = result.val() ;
      for ( const key in data ) {
        if (auth.currentUser.uid === data[key].playerBlack || auth.currentUser.uid === data[key].playerWhite ) {
          addToGame(key)
        } 
      }
    });
  });

  onValue(ref(db, '/game/'), (result) => {
    const data = result.val() ;
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
    //pull deck
    useEffect(() => {
      if(auth?.currentUser?.uid)  {
        const db = ref(getDatabase());
      get(child(db, "decks/"+ auth.currentUser.uid + "/")).then((result) => {
        if(result?.val()) {
          setName1(result?.val()[1]?.name);
          setName2(result?.val()[2]?.name);
          setName3(result?.val()[3]?.name);
          setName4(result?.val()[4]?.name);
        }
      });
    }
    },[auth?.currentUser?.uid]);

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
       <Button value={"3 min"} width={"150px"} clicked={type === "3 min" ? true : false}/>
      </div>
      <div onClick={() => setType("10 min")} className="queueScreen__button">
       <Button value={"10 min"} width={"150px"} clicked={type === "10 min" ? true : false}/>
      </div>
    </div>

    <h2 >Decks</h2>
    <div className="queueScreen__box">
      <div onClick={() => name1 !== undefined && setDeck(1)} className="queueScreen__button">
       <Button value={name1} width={"150px"} clicked={deck === 1 ? true : false}/>
      </div>
      <div onClick={() => name2 !== undefined && setDeck(2)} className="queueScreen__button">
       <Button value={name2} width={"150px"} clicked={deck === 2 ? true : false}/>
      </div>
    </div>
    <div className="queueScreen__box">
      <div onClick={() => name3 !== undefined && setDeck(3)} className="queueScreen__button">
       <Button value={name3} width={"150px"} clicked={deck === 3 ? true : false}/>
      </div>
      <div onClick={() => name4 !== undefined && setDeck(4)} className="queueScreen__button">
       <Button value={name4} width={"150px"} clicked={deck === 4 ? true : false}/>
      </div>
    </div>
    {deck && type ?
      <div onClick={() => handleClick()} className="queueScreen__buttonLarge">
        <Button value={"Start Game"} width={"320px"}/>
      </div> 
      : null}
    
    </div>
    </div>
    </div>

  )
}