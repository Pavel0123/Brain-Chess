import React, { useState, useEffect} from "react";
import "./HomeScreen.css"
import {useNavigate} from 'react-router-dom';
import { ReactComponent as Icon1 } from "../images/board-icon.svg" 
import { ReactComponent as Icon2 } from "../images/play-icon.svg" 
import { ReactComponent as Icon3 } from "../images/user-icon.svg" 
import Box from "../components/Box";
import BoardCard from "../components/BoardCard"
import { auth} from "../firebase"

export default function HomeScreen()  {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if(auth?.currentUser?.uid)  {
      setAuthed(true);
    }
    auth.onAuthStateChanged(() => {
      if(auth?.currentUser?.uid)  {
        setAuthed(true);
      }else{
        setAuthed(false);
      }
    });
  }, []);

  return(
    <div>    
    <div className="homeScreen__body">
    <div className="homeScreen__container">
      {authed ?
    <div className="homeScreen__box">
       <BoardCard onClick={() => navigate("/queue")} icon={<Icon2 className="homeScreen__icon2"/> } value={"Play"}/>
       <BoardCard onClick={() => navigate("/boards")} icon={<Icon1 className="homeScreen__icon1"/> } value={"Boards"}/>
    </div>
    : 
    <div className="homeScreen__box">
      <BoardCard onClick={() => navigate("/login")} icon={<Icon3 className="homeScreen__icon2"/> } value={"Login"}/>
    </div>}
    </div>
    </div>
    <div className="homeScreen__history">
      <h2 className="homeScreen__h1" >Info and Rules</h2>
      <div className="homeScreen__history-container">
      <Box value={"Welcome"} text={"We are a web application similar to chess, where the user can create their own deck !!!"} width={"360px"}></Box>
      <Box value={"Changes"} text={"Pawns can only move one square forward. Castling is not allowed. The game ends with the dismissal of the king, not by checkmate."} width={"360px"}></Box>
      <Box value={"Decks"} text={"Each user can wipe up to 4 decks. The deck must contain a king. The figures can be built on the first two rows, the pawns can be on the first third rows."} width={"360px"}></Box>
      <Box value={"New Figures"} text={"Coming soon !!!"} width={"360px"}></Box>
      <Box width={"360px"}></Box>
      </div>
    </div>
    </div>

  )
}