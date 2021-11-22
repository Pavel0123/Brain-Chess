import React from "react";
import {useNavigate} from 'react-router-dom';
import "./FallbackScreen.css"

export default function HomeScreen()  {
  let navigate = useNavigate();
  return(
    <div>
    <h2 className="fallbackScreen__h1">Page not found</h2>
    <p onClick={() => navigate("/home")} className="fallbackScreen__p" >Click to to Home</p>
    </div>
  )
}