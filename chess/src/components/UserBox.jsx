import React from "react";
import "./UserBox.css"

const UserBox = ({ value, width, text }) => {
  return(
    <div style={{width: width}} className="userBox__container">
      <h2 className="userBox__h2">{value}</h2>
      <p className="userBox__p">{text}</p>
    </div> 
  )
}

export default UserBox;