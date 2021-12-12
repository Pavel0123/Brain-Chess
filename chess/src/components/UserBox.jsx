import React from "react";
import "./UserBox.css"

const UserBox = ({onClick, value, width, text }) => {
  return(
    <div onClick={onClick} style={{width: width}} className="userBox__container">
      <h2 className="userBox__h2">{value}</h2>
      <p className="userBox__p">{text}</p>
    </div> 
  )
}

export default UserBox;