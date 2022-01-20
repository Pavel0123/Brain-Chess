import React, {useState ,useEffect} from "react";
import { ReactComponent as Icon1 } from "../images/three-lines-icon.svg" 
import { ReactComponent as Icon2 } from "../images/x-icon.svg"
import { ReactComponent as Icon3 } from "../images/home-icon.svg"  
import { ReactComponent as Icon4 } from "../images/user-icon.svg" 
import { ReactComponent as Icon5 } from "../images/chess-board-icon.svg" 
import { ReactComponent as Icon6 } from "../images/play-icon.svg" 
import { ReactComponent as Icon7 } from "../images/figure-icon.svg" 
import {useNavigate} from 'react-router-dom';
import {login, logout, disconect, signIn, auth} from "../firebase"

import "./Navbar.css"

function Navbar() {
  const [checked, setchecked] = useState(true);
  const navigate = useNavigate();
  
  const Unchecked = (
    <Icon1 onClick={() => setchecked(!checked)} className="Navbar__icon"></Icon1>
    )
  
  const Checked = (
    <div className="Navbar__checked-body">
    <div className="Navbar__checked-container">
      <div className="Navbar__checked-head">
        <Icon2 onClick={() => setchecked(!checked)} className="Navbar__checked-icon"/>
        {!auth.currentUser ? <div onClick={() => {navigate("/login"); setchecked(!checked)}} >
          <h2 className="Navbar__checked-h3">Login</h2>
        </div> : <div onClick={() => {logout(); auth.signOut(); setchecked(!checked); navigate("/home"); window.location.reload()}} >
          <h2 className="Navbar__checked-h3">Logout</h2>
        </div>}
        
      </div>
      
      {auth?.currentUser ?
      <div>
        {Link(Icon6, "Play", "/queue")}
        {Link(Icon3, "Home", "/home")}
        {Link(Icon7, "Figures", "/figures")}
        {Link(Icon5, "Boards", "/boards")}
        {Link(Icon4, "Account", "/account")}
      </div> :
      <div>
        {Link(Icon3, "Home", "/home")}
        {Link(Icon7, "Figures", "/figures")}
        {Link(Icon4, "Login", "/login")}
      </div> }
      
    </div>
    </div>
  )


  useEffect(() => {
    if(auth?.currentUser) {
      login();
      disconect();
    }
  }, [auth?.currentUser]);


  function Link(Icon , text, onClick)  {
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
      <h1 className="Navbar__h1">{"Brain Chess"}</h1>
    </div> 
  )
}

export default Navbar;