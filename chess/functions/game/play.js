const functions = require("firebase-functions").region('europe-west1');
const { database } = require("firebase-admin");

exports.playTurn = functions.https.onCall(async(data, context) => {
  //check user is in game
  if(!context.auth.token) {
    return {
      status: "error"
    }
  }
  const game = data.game
  const from = data.from;
  const to = data.to;
  let turns;
  let deck;
  let whitePlayer;
  let blackPlayer;
  let timeWhite;
  let timeBlack;
  let startTurn = Math.floor(Date.now() / 1000);

  await database().ref("game/" + game + "/")
            .get().then((result) => {
              const test = result.val();
              whitePlayer = test.playerWhite;
              blackPlayer = test.playerBlack;
              deck = test.deck;
              turns = test.turns;
              timeWhite = test.timeWhite
              timeBlack = test.timeBlack
              startTurn = test?.startTurn
  });

  if(context.auth.uid !== whitePlayer && context.auth.uid !== blackPlayer) {
    return {
      status: "error"
    } 
  }

  if(!checkTurn(deck,turns,from, to )) {
    return {
      status: "error"
    } 
  }

  await checkTime(game);

  let counter = 0;
  for ( const key in turns ) {
    counter++;
  }
  const timediff = Math.floor(Date.now() / 1000) - startTurn;
 
  if(whitePlayer === context.auth.uid) {
    if(counter % 2 === 1){
      return {
        status: "error"
      }
    }
    else{
      timeWhite = timeWhite - timediff + 3;
    }
  }
  else{
    if(counter % 2 === 0){
      return {
        status: "error"
      }
    }
    else{
      timeBlack = timeBlack - timediff + 3;
    }
  }
  await database().ref("game/"+ game + "/").update({timeBlack: timeBlack, timeWhite: timeWhite, startTurn: Math.floor(Date.now() / 1000)});
  await database().ref("game/"+ game + "/turns/" + counter).update({from: from, to: to});

  if(checkWin(deck, turns, from , to) === "white")  {
    await archiveGame(game, "white")
    return {
      status: "white"
    }
  }

  if(checkWin(deck, turns, from , to) === "black")  {
    await archiveGame(game, "black")
    return {
      status: "black"
    }
  }

  await checkDraw(game, deck, turns,from , to);
  
  return {
    status: "ok"
  };
});

exports.time = functions.https.onCall(async(data, context) => {
  const uid = context.auth.uid;
  let game;
  await database().ref("users/" + uid + "/")
            .get().then((result) => {
              const test = result.val();
              game = test.game;
            });
  checkTime(game)
  return {
    status: "ok"
  }
});


exports.surender = functions.https.onCall(async(data, context) => {
  const uid = context.auth.uid;
  let game;
  let playerWhite;
  await database().ref("users/" + uid + "/")
            .get().then((result) => {
              const test = result.val();
              game = test.game;
  });

  await database().ref("game/" + game + "/")
  .get().then((result) => {
    const test = result.val();
    playerWhite = test.playerWhite;
});
  
  if(playerWhite === uid) {
    archiveGame(game, "black")
  }
  else {
    archiveGame(game, "white")
  }
  return {
    status: "ok"
  }
});


exports.draw = functions.https.onCall(async(data, context) => {
  const uid = context.auth.uid;
  let game;
  let playerWhite;
  let drawWhite;
  let drawBlack;
  await database().ref("users/" + uid + "/")
            .get().then((result) => {
              const test = result.val();
              game = test.game;
  });

  await database().ref("game/" + game + "/")
  .get().then((result) => {
    const test = result.val();
    playerWhite = test.playerWhite;
  });
  
  if(playerWhite === uid) {
    await database().ref("game/"+ game + "/").update({drawWhite: true});
  }
  else {
    await database().ref("game/"+ game + "/").update({drawBlack: true});
  }

  await database().ref("game/" + game + "/")
  .get().then((result) => {
    const test = result.val();
    drawWhite = test?.drawWhite;
    drawBlack = test?.drawBlack;
  });

  if(drawWhite && drawBlack)  {
    archiveGame(game, "draw")
  }

  return {
    status: "ok"
  }
});

exports.drawDecline = functions.https.onCall(async(data, context) => {
  const uid = context.auth.uid;
  let game;
  await database().ref("users/" + uid + "/")
            .get().then((result) => {
              const test = result.val();
              game = test.game;
  });

  await database().ref("game/"+ game + "/").update({drawWhite: false, drawBlack: false});
  
  return {
    status: "ok"
  }
});



function checkWin(deck, turns, from , to) {
  const data = turns ;
  let array = deck;
  let array1 = [];
  let whiteking = false;
  let blackking = false;

  array.map((element) => {
    array1.push({field: element});
  });     
  
  for ( const key in data ) {
    let from = data[key].from;
    let to = data[key].to;
    
    array1[to] = {field:array1[from]?.field }
    array1[from] = {field: 0};
  }
  array1[to] = {field:array1[from]?.field }
  array1[from] = {field: 0};
  
  for ( const key in array1 ) {
    let field = array1[key].field;
    
    if(field === 1 || field === 7) {
      whiteking = true;
    }
    if(field === 11 || field === 17) {
      blackking = true;
    }
  }

  if(!blackking) {
    return "white"
  }
  if(!whiteking) {
    return "black"
  }
}




async function archiveGame(game, winner) {
  let playerWhite;
  let playerWhiteRating;
  let playerBlack;
  let playerBlackRating;
  let deck;
  let turns;
  await database().ref("game/" + game + "/")
            .get().then((result) => {
              const values = result.val();
              playerWhite = values.playerWhite;
              playerBlack = values.playerBlack;
              deck = values.deck;
              turns = values.turns;             
  });
  await database().ref("users/" + playerWhite + "/")
            .get().then((result) => {
              const values = result.val();
              playerWhiteRating = values.rating;      
  });
  await database().ref("users/" + playerBlack + "/")
  .get().then((result) => {
    const values = result.val();
    playerBlackRating = values.rating;      
  });

  if(winner !== "draw")  {
  if(winner === "white")  {
    await database().ref("users/" + playerWhite + "/").update({rating: playerWhiteRating + 10});
    await database().ref("users/" + playerBlack + "/").update({rating: playerBlackRating - 10});
  } else {
    await database().ref("users/" + playerWhite + "/").update({rating: playerWhiteRating - 10});
    await database().ref("users/" + playerBlack + "/").update({rating: playerBlackRating + 10});
  }
  }

  await database().ref("archived/"+ game + "/").update({playerWhite: playerWhite
    , playerBlack: playerBlack, deck: deck, turns: turns, winner: winner});

  await database().ref("game/" + game + "/").remove();
}




async function checkTime(game)  {
  let timeWhite;
  let timeBlack;
  let startTurn;
  let turns;

  await database().ref("game/" + game + "/")
  .get().then((result) => {
    const test = result.val();
    timeWhite = test.timeWhite
    timeBlack = test.timeBlack
    turns = test.turns
    startTurn = test?.startTurn
});

  let counter = 0;
  for ( const key in turns ) {
    counter++;
  }

  const timediff = Math.floor(Date.now() / 1000) - startTurn;


  if(counter % 2 === 1){
    if(timeBlack - timediff + 3 <= 0)  {
      await archiveGame(game,"white");
      return true;
    }
  }
  else{
    if(timeWhite - timediff + 3 <= 0)  {
      await archiveGame(game,"black");
      return true;
    }
  }
  return false;
}

//check draw

function checkDraw(game, array, data, from , to) {
  let deck = [];
  let counter = 0;

  array.map((element) => {
    deck.push({field: element});
  });     

  for ( const key in data ) {
    let from = data[key].from;
    let to = data[key].to;
    
    deck = playMove(deck, from, to )
  }
  deck[to] = {field:deck[from]?.field }
  deck[from] = {field: 0};

  deck.map((element) => {
    let x = element.field;
    switch(x) {
    case 2:
      counter = counter + 1;
    break
    case 3:
      counter = counter + 1;
    break
    case 4:
      counter = counter + 0.5;
    break
    case 5:
      counter = counter + 0.5;
    break
    case 6:
      counter = counter + 1;
    break
    case 12:
      counter = counter + 1;
    break
    case 13:
      counter = counter + 1;
    break
    case 14:
      counter = counter + 0.5;
    break
    case 15:
      counter = counter + 0.5;
    break
    case 16:
      counter = counter + 1;
    break
    default:
    }
  });
  console.log(counter + " counter");
  if(counter < 1) {
    archiveGame(game, "draw")
  }
}

//validate turns

function checkTurn(array, turns, from, to) {
  const data = turns ;
  let array1 = [];
  let counter = 0;
  let valid = true;

  array.map((element) => {
    array1.push({field: element});
  });     

  for ( const key in data ) {
    let from = data[key].from;
    let to = data[key].to;
    
    array1 = playMove(array1, from, to )
    counter++;
  }

  if(counter % 2 === 1){
    if(array1[from].field === 0 || array1[from].field === 10 || array1[from].field <= 10) {
      return false;
    }
    if(array1[to].field >= 11 ) {
      return false;
    }
  } else {
    if(array1[from].field === 0 || array1[from].field === 10 || array1[from].field >= 10) {
      return false;
    }
    if(array1[to].field <= 9 && array1[to].field >= 1 ) {
      return false;
    }
  }

  switch (array1[from].field) {
    case 1:
      valid = checkKing(array1,from,to)
    break;
    case 2:
      valid = checkQueen(array1,from,to)
    break;
    case 3:
      valid = checkRook(array1,from,to)
    break;
    case 4:
      valid = checkBishup(array1,from,to)
    break;
    case 5:
      valid = checkHorse(array1,from,to)
    break;
    case 6:
      valid = checkWhitePawn(array1,from,to)
    break;
    case 7:
      valid = checkKing(array1,from,to)
    break;
    case 8:
      valid = checkDragon(array1,from,to)
    break;
    case 9:
      valid = checkGuard(array1,from,to)
    break;
    case 11:
      valid = checkKing(array1,from,to)
    break;
    case 12:
      valid = checkQueen(array1,from,to)
    break;
    case 13:
      valid = checkRook(array1,from,to)
    break;
    case 14:
      valid = checkBishup(array1,from,to)
    break;
    case 15:
      valid = checkHorse(array1,from,to)
    break;
    case 16:
      valid = checkBlackPawn(array1,from,to)
    break;
    case 17:
      valid = checkKing(array1,from,to)
    break;
    case 18:
      valid = checkDragon(array1,from,to)
    break;
    case 19:
      valid = checkGuard(array1,from,to)
    break;
    default:
  }
  if(valid) {
  return true
  }
  return false; 
}

function playMove(array1, from, to) {
  if(array1[from].field === 6 && to >= 56)  {
    array1[to] = {field:2 ,selected: false}
    array1[from] = {field:0 ,selected: false};
    return array1;
  }

  if(array1[from].field === 16 && to <= 7)  {
    array1[to] = {field:12 ,selected: false}
    array1[from] = {field:0 ,selected: false};
    return array1;
  }

  array1[to] = {field:array1[from]?.field ,selected: false}
  array1[from] = {field:0 ,selected: false};
  return array1
}

//figures moves

function checkKing(array , from, to)  {
  if((from -9 === to || from -1 === to || from +7 === to) && from % 8 === 0)  {
    return false;
  }
  if((from +9 === to || from +1 === to || from -7 === to) && from % 8 === 7)  {
    return false;
  }

  if(from +8 === to || from -8 === to || from +1 === to || from -1 === to)  {
    return true;
  }
  if(from +7 === to || from -7 === to || from +9 === to || from -9 === to)  {
    return true;
  }
  return false;
}

function checkGuard(array , from, to)  {
  if(from -1 === to && from % 8 === 0)  {
    return false;
  }
  if(from +1 === to && from % 8 === 7)  {
    return false;
  }

  if(from +8 === to || from -8 === to || from +1 === to || from -1 === to)  {
    return true;
  }

  return false;
}

function checkQueen(array , from, to)  {
  if(checkRook(array , from, to) || checkBishup(array , from, to))  {
    return true;
  }
  return false;
}

function checkRook(array , from, to)  {
  const dif = from - to;
  if(dif % 8 === 0 )  {
    const sum = (from - to) / 8;
    let count = from;
    for(let x = 0;x !== sum && x !== -sum ; x ++) {
      if(from < to) {
        count = count + 8;
      }
      else{
        count = count - 8;
      }
      if(array[count].field !== 0 && array[count].field !== 10 && count !== to) {
        return false;
      }
    }
    return true;
  }
  if(Math.floor(from / 8) === Math.floor(to / 8) )  {
    const sum = from - to;
    let count = from;
    for(let x = 0;x !== sum && x !== -sum ; x ++) {
      if(from < to) {
        count = count + 1;
      }
      else{
        count = count - 1;
      }
      if(array[count].field !== 0 && array[count].field !== 10 && count !== to) {
        return false;
      }
    }
    return true
  }


  return false;
}

function checkBishup(array , from, to)  {
  if((from % 8 - to % 8) +  (Math.floor(from / 8) - Math.floor(to / 8)) === 0)  {
    const sum = (from - to) / 7;
    let count = from;
    for(let x = 0;x !== sum && x !== -sum ; x ++) {
      if(from < to) {
        count = count + 7;
      }
      else{
        count = count - 7;
      }
      if(array[count].field !== 0 && array[count].field !== 10 && count !== to) {
        return false;
      }
    }
    return true;
  }
  if((from % 8 - to % 8) -  (Math.floor(from / 8) - Math.floor(to / 8)) === 0){
    const sum = (from - to) / 9;
    let count = from;
    for(let x = 0;x !== sum && x !== -sum ; x ++) {
      if(from < to) {
        count = count + 9;
      }
      else{
        count = count - 9;
      }
      if(array[count].field !== 0 && array[count].field !== 10 && count !== to) {
        return false;
      }
    }
    return true;
  }

  return false;
}

function checkHorse(array , from, to)  {
  if((from % 8 - to % 8 === 1 || from % 8 - to % 8 === -1) && (Math.floor(from / 8) - Math.floor(to / 8) === 2 || Math.floor(from / 8) - Math.floor(to / 8) === -2))  {
    return true;
  }
  if((from % 8 - to % 8 === 2 || from % 8 - to % 8 === -2) && (Math.floor(from / 8) - Math.floor(to / 8) === 1 || Math.floor(from / 8) - Math.floor(to / 8) === -1))  {
    return true;
  }
  return false;
}

function checkDragon(array , from, to)  {
  if((from % 8 - to % 8 === 1 || from % 8 - to % 8 === -1) && (Math.floor(from / 8) - Math.floor(to / 8) === 2 || Math.floor(from / 8) - Math.floor(to / 8) === -2))  {
    return true;
  }
  if((from % 8 - to % 8 === 2 || from % 8 - to % 8 === -2) && (Math.floor(from / 8) - Math.floor(to / 8) === 1 || Math.floor(from / 8) - Math.floor(to / 8) === -1))  {
    return true;
  }
  if((from % 8 - to % 8 === 2 || from % 8 - to % 8 === -2) && (Math.floor(from / 8) - Math.floor(to / 8) === 2 || Math.floor(from / 8) - Math.floor(to / 8) === -2))  {
    return true;
  }
  return false;
}

function checkWhitePawn(array , from, to)  {
  if(Math.floor(from / 8) - Math.floor(to / 8) !== -1) {
    return false;
  }
  if(from +8 === to && (array[to].field === 0 || array[to].field === 10))  {
    return true;
  }
  if((from +9 === to || from +7 === to) && (array[to].field !== 0 && array[to].field !== 10))  {
    return true;
  }
  return false;
}

function checkBlackPawn(array , from, to)  {
  if(Math.floor(from / 8) - Math.floor(to / 8) !== 1) {
    return false;
  }
  if(from -8 === to && (array[to].field === 0 || array[to].field === 10))  {
    return true;
  }
  if((from -9 === to || from -7 === to) && (array[to].field !== 0 && array[to].field !== 10))  {
    return true;
  }
  return false;
}

