import React,{ useState } from "react";
import "./Input.css"

const Input = ({ onSubmit, width, height , placeholder }) => {
  const [value, setValue] = useState("");
  return(
      <form onSubmit={onSubmit} onChange={(e) => setValue(e.target.value)}>
          <input className="Input__container" style={{width: width , height: height}} value={value} placeholder={placeholder} type="text" />
      </form>
  )
}

export default Input;

