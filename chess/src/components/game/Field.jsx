import React, {useState, useEffect} from "react";
import "./Field.css"
import { ReactComponent as Nothing } from "../../images/figures/Nothing.svg"
import { ReactComponent as WhiteKing } from "../../images/figures/White-King.svg" 
import { ReactComponent as WhiteQueen } from "../../images/figures/White-Queen.svg" 
import { ReactComponent as WhitePrince } from "../../images/figures/White-Prince.svg" 
import { ReactComponent as WhiteDragon } from "../../images/figures/White-Dragon.svg" 
import { ReactComponent as WhiteRook } from "../../images/figures/White-Rook.svg" 
import { ReactComponent as WhiteBishop } from "../../images/figures/White-Bishop.svg" 
import { ReactComponent as WhiteHorse } from "../../images/figures/White-Horse.svg" 
import { ReactComponent as WhiteGuard } from "../../images/figures/White-Guard.svg"
import { ReactComponent as WhitePawn } from "../../images/figures/White-Pawn.svg" 
import { ReactComponent as BlackKing } from "../../images/figures/Black-King.svg" 
import { ReactComponent as BlackQueen } from "../../images/figures/Black-Queen.svg" 
import { ReactComponent as BlackPrince } from "../../images/figures/Black-Prince.svg" 
import { ReactComponent as BlackDragon } from "../../images/figures/Black-Dragon.svg" 
import { ReactComponent as BlackRook } from "../../images/figures/Black-Rook.svg" 
import { ReactComponent as BlackBishop } from "../../images/figures/Black-Bishop.svg" 
import { ReactComponent as BlackHorse } from "../../images/figures/Black-Horse.svg" 
import { ReactComponent as BlackGuard } from "../../images/figures/Black-Guard.svg" 
import { ReactComponent as BlackPawn } from "../../images/figures/Black-Pawn.svg" 

const Field = ({color, value, selected, onClick }) => {
  const style = `field__container field__container-${color} ${selected && "field__container-selected"}` ;
  const [figure, setFigure] = useState()

  

  useEffect(() => {
    switch(value) {
      case 1:
        setFigure( <WhiteKing className="field__container-icon" />)
        return;
      case 2:
        setFigure( <WhiteQueen className="field__container-icon" />)
        return;
      case 3:
          setFigure( <WhiteRook className="field__container-icon" />)
        return;
      case 4:
          setFigure( <WhiteBishop className="field__container-icon" />)
        return;
      case 5:
            setFigure( <WhiteHorse className="field__container-icon" />)
        return;
      case 6:
            setFigure( <WhitePawn className="field__container-icon" />)
        return;
      case 7:
          setFigure( <WhitePrince className="field__container-icon" />)
      return;
      case 8:
        setFigure( <WhiteDragon className="field__container-icon" />)
      return;
      case 9:
        setFigure( <WhiteGuard className="field__container-icon" />)
      return;
      case 11:
          setFigure( <BlackKing className="field__container-icon" />)
        return;
      case 12:
          setFigure( <BlackQueen className="field__container-icon" />)
        return;
      case 13:
            setFigure( <BlackRook className="field__container-icon" />)
        return;
      case 14:
            setFigure( <BlackBishop className="field__container-icon" />)
        return;
      case 15:
              setFigure( <BlackHorse className="field__container-icon" />)
        return;
      case 16:
              setFigure( <BlackPawn className="field__container-icon" />)
        return;
      case 17:
          setFigure( <BlackPrince className="field__container-icon" />)
      return;
      case 18:
        setFigure( <BlackDragon className="field__container-icon" />)
      return;
      case 19:
        setFigure( <BlackGuard className="field__container-icon" />)
      return;
      
      default:
        setFigure(<Nothing className="field__container-icon" />)
    }

  },[value]);
  
  return (
    <div className={style} onClick={onClick}>
      {figure}
    </div>
  );
};

export default Field;