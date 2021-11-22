import React, {useState} from "react";
import { ReactComponent as Icon1 } from "../images/three-lines-icon.svg" 
import { ReactComponent as Icon2 } from "../images/x-icon.svg"
import { ReactComponent as Icon3 } from "../images/home-icon.svg"  
import { ReactComponent as Icon4 } from "../images/user-icon.svg" 
import { ReactComponent as Icon5 } from "../images/chess-board-icon.svg" 
import { ReactComponent as Icon6 } from "../images/play-icon.svg" 
import {useNavigate} from 'react-router-dom';
import "./Navbar.css"

function Navbar() {
  const [checked, setchecked] = useState(true);
  
  const Unchecked = (
    <Icon1 onClick={() => setchecked(!checked)} className="Navbar__icon"></Icon1>
    )
  
  const Checked = (
    <div className="Navbar__checked-container">
      <Icon2 onClick={() => setchecked(!checked)} className="Navbar__checked-icon"/>
      {Link(Icon6, "Play", "/play")}
      {Link(Icon3, "Home", "/home")}
      {Link(Icon5, "Boards", "/boards")}
      {Link(Icon4, "Account", "/account")}
    </div>
  )

  function Link(Icon , text, onClick)  {
    let navigate = useNavigate();
    return(
    <div onClick={() => {navigate(onClick); setchecked(!checked)}} className="Navbar__checked-box">
        <Icon className="Navbar__checked-icon"/>
        <h2 className="Navbar__checked-h2">{text}</h2>
    </div>
    )
  }
  return(
    <div className="Navbar__container">
      <div className="Navbar__switch" >{checked ? Unchecked : Checked}</div>
      <h1 className="Navbar__h1">Brain Chess</h1>
    </div> 
  )
}

export default Navbar;