import React ,{useEffect} from "react";
import "./LoginScreen.css"
import { ReactComponent as Icon1 } from "../images/google-icon.svg" 
import { signIn} from "../firebase";

export default function HomeScreen()  {

  return(  
    <div className="LoginScreen__body">
    <div className="LoginScreen__container">
    <h2>Login with</h2>
    <div onClick={() => signIn()} className="LoginScreen__box">
      <Icon1/>
      <h3 className="LoginScreen__h3">Google</h3>
    </div>
    </div>
    </div>

  )
}