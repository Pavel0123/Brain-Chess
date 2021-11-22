import React from "react";
import {useNavigate} from 'react-router-dom';
import { ReactComponent as Icon1 } from "../images/board-icon.svg" 
import BoardCard from "../components/BoardCard"
import "./BoardsScreen.css"

export default function HomeScreen()  {
  const navigate = useNavigate();
  return(
    <div className="boardScreen__body">
    <div className="boardScreen__container">

    <div className="boardScreen__box">
    <BoardCard onClick={() => navigate("/board-creator-1")} icon={<Icon1 className="boardScreen__icon"/> } value={"Empty"}/>
    <BoardCard onClick={() => navigate("/board-creator-2")} icon={<Icon1 className="boardScreen__icon"/> } value={"Empty"}/>
    </div>
    <div className="boardScreen__box">
    <BoardCard onClick={() => navigate("/board-creator-3")} icon={<Icon1 className="boardScreen__icon"/> }  value={"Empty"}/>
    <BoardCard onClick={() => navigate("/board-creator-4")} icon={<Icon1 className="boardScreen__icon"/> }  value={"Empty"}/>
    </div>

    </div>
    </div>
  )
}