
function Pieces(figure) {
  let array = Array(64).fill(0);
  let result = {};

  switch(figure) {
    case 1:
      array = king();
      result = {figure: "King", text: "King is the main figure. The game ends with the dismissal of the king.", board: king()}
    break
    case 2:
      array = queen();
      result = {figure: "Queen", text: "Queen is the strongest and at the same time the most expensive figure. She can do a lot of damage in the right hands.", board: queen()}
    break
    case 3:
      array = rook();
      result = {figure: "Rook", text: "Rook is very strong at late game for a reasonable price.", board: rook()}
    break
    case 4:
      array = bishup();
      result = {figure: "Bishup", text: "Bishop is cheap and great for controlling diagonals.", board: bishup()}
    break
    case 5:
      array = horse();
      result = {figure: "Horse", text: "Horse is cheap and unpredictable can do a lot of damage with a low risk.", board: horse()}
    break
    case 6:
      array = pawn();
      result = {figure: "Pawn", text: "Pawn is the cheapest figure. His strength lies in the fact that when he crosses the board he turns into a queen", board: pawn()}
    break
    case 7:
      array = prince();
      result = {figure: "Prince", text: "Prince serves as the king's deputy. The game does not end as long as the prince is present.", board: prince()}
    break
    case 8:
      array = dragon();
      result = {figure: "Dragon", text: "Dragon is a strong and unpredictable figure. He can fly over figures and there is no way to avoid his power.", board: dragon()}
    break
    case 9:
      array = guard();
      result = {figure: "Guard", text: "Guard is able to defend a lot of figures at once for a very cheap price. His strength does not lie in the attack rather than the ability to defend others.", board: guard()}
    break
    default:
    }

  return(
    result
  )
}

function king() {
  let array = Array(64).fill(0);
  array[35] = {field: 1, last: true}
  array[34] = {last: true}
  array[36] = {last: true}
  array[28] = {last: true}
  array[27] = {last: true}
  array[26] = {last: true}
  array[42] = {last: true}
  array[43] = {last: true}
  array[44] = {last: true}
  return array;
}

function queen() {
  let array = Array(64).fill(0);
  array[35] = {field: 2, last: true}
  array[34] = {last: true}
  array[33] = {last: true}
  array[32] = {last: true}
  array[36] = {last: true}
  array[37] = {last: true}
  array[38] = {last: true}
  array[39] = {last: true}
  array[27] = {last: true}
  array[19] = {last: true}
  array[11] = {last: true}
  array[3] =  {last: true}
  array[43] = {last: true}
  array[51] = {last: true}
  array[59] = {last: true}
  array[7] = {last: true}
  array[14] = {last: true}
  array[21] = {last: true}
  array[28] = {last: true}
  array[42] = {last: true}
  array[49] = {last: true}
  array[56] = {last: true}
  array[8] = {last: true}
  array[17] = {last: true}
  array[26] = {last: true}
  array[44] = {last: true}
  array[53] = {last: true}
  array[62] = {last: true}
  return array;
}

function prince() {
  let array = Array(64).fill(0);
  array[35] = {field: 7, last: true}
  array[34] = {last: true}
  array[36] = {last: true}
  array[28] = {last: true}
  array[27] = {last: true}
  array[26] = {last: true}
  array[42] = {last: true}
  array[43] = {last: true}
  array[44] = {last: true}
  return array;
}

function dragon() {
  let array = Array(64).fill(0);
  array[35] = {field: 8, last: true}
  array[45] = {last: true}
  array[25] = {last: true}
  array[41] = {last: true}
  array[29] = {last: true}
  array[18] = {last: true}
  array[20] = {last: true}
  array[52] = {last: true}
  array[50] = {last: true}
  array[53] = {last: true}
  array[49] = {last: true}
  array[17] = {last: true}
  array[21] = {last: true}
  return array;
}

function rook() {
  let array = Array(64).fill(0);
  array[35] = {field: 3, last: true}
  array[34] = {last: true}
  array[33] = {last: true}
  array[32] = {last: true}
  array[36] = {last: true}
  array[37] = {last: true}
  array[38] = {last: true}
  array[39] = {last: true}
  array[27] = {last: true}
  array[19] = {last: true}
  array[11] = {last: true}
  array[3] =  {last: true}
  array[43] = {last: true}
  array[51] = {last: true}
  array[59] = {last: true}
  return array;
}

function horse() {
  let array = Array(64).fill(0);
  array[35] = {field: 5, last: true}
  array[45] = {last: true}
  array[25] = {last: true}
  array[41] = {last: true}
  array[29] = {last: true}
  array[18] = {last: true}
  array[20] = {last: true}
  array[52] = {last: true}
  array[50] = {last: true}
  return array;
}

function bishup() {
  let array = Array(64).fill(0);
  array[35] = {field: 4, last: true}
  array[7] = {last: true}
  array[14] = {last: true}
  array[21] = {last: true}
  array[28] = {last: true}
  array[42] = {last: true}
  array[49] = {last: true}
  array[56] = {last: true}
  array[8] =  {last: true}
  array[17] = {last: true}
  array[26] = {last: true}
  array[44] = {last: true}
  array[53] = {last: true}
  array[62] = {last: true}
  return array;
}

function guard() {
  let array = Array(64).fill(0);
  array[35] = {field: 9, last: true}
  array[34] = {last: true}
  array[36] = {last: true}
  array[27] = {last: true}
  array[43] = {last: true}
  return array;
}

function pawn() {
  let array = Array(64).fill(0);
  array[35] = {field: 6, last: true}
  array[26] = {field: 16, last: true}
  array[27] = {last: true}
  array[28] = {field: 16, last: true}
  return array;
}

export default Pieces;