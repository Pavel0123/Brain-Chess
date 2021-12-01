import React, {useEffect, useState} from "react";
import UserBox from "../components/UserBox";
import {auth} from "../firebase"
import { child, get } from "firebase/database";
import { getDatabase, ref } from "firebase/database"
import "./AccountScreen.css"

export default function HomeScreen()  {
  const [user, setUser] = useState(null);
  const [games, setGames] = useState(null);
  const db = ref(getDatabase());
  
  useEffect(() => {
    if(auth?.currentUser?.uid)  {
      getUserInfo();
      getUserGames();
    }
  },[]);

  function getUserInfo()  {
    get(child(db, "users/"+ auth?.currentUser?.uid + "/")).then((result) => {
      setUser(result?.val());
    });
  }

  function getUserGames()  {
    get(child(db, "archived/")).then((result) => {
      const data = result.val();
      let array = [];
      for(const game in data)  {
        if(data[game].playerBlack || data[game].playerWhite === auth?.currentUser?.uid) {
          const date = new Date(game * 1)
          let winner = "Lose";
          if(data[game].playerWhite === auth?.currentUser?.uid && data[game].winner === "white" )  {
            winner = "Win"
          }
          if(data[game].playerBlack === auth?.currentUser?.uid && data[game].winner === "black" )  {
            winner = "Win"
          }
          array.push(<UserBox key={game} value={winner} text={date.getDay()+"."+ date.getMonth() +"."+  date.getFullYear()} width={"300px"}/>)
        }
      }
      setGames(array) 
      
    });
  }

  return(
    <div>
    <div className="accountScreen__body">
    <div className="accountScreen__container">
    <UserBox value={"Username:"} text={user?.name} width={"300px"}/>
    <UserBox value={"Email:"} text={user?.email} width={"300px"}/>
    <UserBox value={"Rating:"} text={user?.rating} width={"300px"}/>
    </div>
    </div>
    <div className="accountScreen__history">
      <h2 className="accountScreen__h1" >Match History</h2>
      <div className="accountScreen__history-container">{games}</div>
    </div>
    </div>
  )
}