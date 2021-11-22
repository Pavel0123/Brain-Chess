import React from "react";
import "./HomeScreen.css"
import {useNavigate} from 'react-router-dom';
import { ReactComponent as Icon1 } from "../images/board-icon.svg" 
import { ReactComponent as Icon2 } from "../images/play-icon.svg" 
import BoardCard from "../components/BoardCard"

export default function HomeScreen()  {
  const navigate = useNavigate();
  return(
    <div>    
    <div className="homeScreen__body">
    <div className="homeScreen__container">
    <div className="homeScreen__box">
       <BoardCard onClick={() => navigate("/play")} icon={<Icon2 className="homeScreen__icon2"/> } value={"Play"}/>
       <BoardCard onClick={() => navigate("/boards")} icon={<Icon1 className="homeScreen__icon1"/> } value={"Boards"}/>
    </div>
    </div>
    </div>
    <div className="homeScreen__history">
      <h1 className="homeScreen__h1" >Match History</h1>
      
    </div>
    </div>

  )
}