import React, {useEffect, useState} from "react";
import UserBox from "../components/UserBox";
import Input from "../components/Input"; 
import Button from "../components/Button";
import {auth ,logout} from "../firebase"
import { child, get } from "firebase/database";
import { getDatabase, ref , update } from "firebase/database"
import { useNavigate } from "react-router";
import "./AccountScreen.css"

export default function HomeScreen()  {
  const [user, setUser] = useState(null);
  const [games, setGames] = useState(null);
  const [changeUsername, setChangeUsername] = useState(false);
  const db = ref(getDatabase());
  const navigate = useNavigate();
  useEffect(() => {
    if(auth?.currentUser?.uid)  {
      getUserInfo();
      getUserGames();
    }
  },[]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const name = event?.target[0]?.value + "";
    if(name.length < 15) {
      updateUsername(name)
    }
  }

  function getUserInfo()  {
    get(child(db, "users/"+ auth?.currentUser?.uid + "/")).then((result) => {
      setUser(result?.val());
    });
  }

  async function updateUsername(username) {
    const db = getDatabase();
    await update(ref(db, "users/"+ auth?.currentUser?.uid), {
      name: username
    }).then((result) => {
      setChangeUsername(false)
      getUserInfo();
    })
  }

  function getUserGames()  {
    get(child(db, "archived/")).then((result) => {
      const data = result.val();
      let array = [];
      for(const game in data)  {
        if(data[game].playerBlack === auth?.currentUser?.uid || data[game].playerWhite === auth?.currentUser?.uid) {
          const date = new Date(game * 1)
          let winner = "Lose";
          if(data[game].playerWhite === auth?.currentUser?.uid && data[game].winner === "white" )  {
            winner = "Win"
          }
          if(data[game].playerBlack === auth?.currentUser?.uid && data[game].winner === "black" )  {
            winner = "Win"
          }
          array.push(<UserBox key={game} value={winner} text={date.getDate()+"."+ (date.getMonth() + 1) +"."+  date.getFullYear()} width={"250px"}/>)
        }
      }
      array.reverse();
      setGames(array) 
      
    });
  }

  return(
    <div>
    <div className="accountScreen__body">
    <div className="accountScreen__container">
      <div className="accountScreen__shadow">
      {changeUsername ? <Input placeholder={user?.name}  height={"41px"} width={"336px"} onSubmit={handleSubmit}/> : <UserBox value={"Username:"} onClick={() => setChangeUsername(true)} text={user?.name} width={"300px"}/>}
      </div>
      <div className="accountScreen__shadow">
        <UserBox value={"Email:"} text={user?.email} width={"300px"}/>
      </div>
      <div className="accountScreen__shadow">
        <UserBox value={"Rating:"} text={user?.rating} width={"300px"}/>
      </div>
    </div>
    </div>
    <div className="accountScreen__history">
      <h2 className="accountScreen__h1" >Match History</h2>
      <div className="accountScreen__history-container">{games}</div>
      <div onClick={() => {logout(); auth.signOut(); navigate("/home"); window.location.reload()}} className="accountScreen__shadow">
        <Button value={"Logout"} width={"340px"}/>
      </div>
    </div>
    </div>
  )
}