import React, {useState,useEffect}from "react";
import {useNavigate} from 'react-router-dom';
import { ReactComponent as Icon1 } from "../images/board-icon.svg" 
import BoardCard from "../components/BoardCard"
import { getDatabase, ref, child, get } from "firebase/database";
import { auth} from "../firebase"
import "./BoardsScreen.css"

export default function HomeScreen()  {
  const navigate = useNavigate();
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [name3, setName3] = useState("");
  const [name4, setName4] = useState("");
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
  return(
    <div className="boardScreen__body">
    <div className="boardScreen__container">

    <div className="boardScreen__box">
    <BoardCard onClick={() => navigate("/board-creator-1")} icon={<Icon1 className="boardScreen__icon"/> } value={name1}/>
    <BoardCard onClick={() => navigate("/board-creator-2")} icon={<Icon1 className="boardScreen__icon"/> } value={name2}/>
    </div>
    <div className="boardScreen__box">
    <BoardCard onClick={() => navigate("/board-creator-3")} icon={<Icon1 className="boardScreen__icon"/> }  value={name3}/>
    <BoardCard onClick={() => navigate("/board-creator-4")} icon={<Icon1 className="boardScreen__icon"/> }  value={name4}/>
    </div>

    </div>
    </div>
  )
}