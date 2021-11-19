import React, {useState} from "react";
import Board from "../../components/game/Board"
import "./PlayScreen.css"

export default function HomeScreen()  {
  const [field, setField] = useState(Array(64).fill(null));

  const handleClick = (i) => {
    field[i] = 1;
    setField([...field]);
    
    console.log(field)
  }

  return(
    <div>
    {<Board fields={field}  onClick={handleClick} />}
    </div>
  )
}