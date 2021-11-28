import React,{ useState } from "react";
import "./Input.css"

const Input = ({ onSubmit, width }) => {
  const [value, setValue] = useState("");
  return(
      <form onSubmit={onSubmit} onChange={(e) => setValue(e.target.value)}>
          <input className="Input__container" style={{width: width}} value={value} placeholder={"Name"} type="text" />
      </form>
  )
}

export default Input;

