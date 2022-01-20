const functions = require("firebase-functions").region('europe-west1');
const { database } = require("firebase-admin");

exports.addDeck = functions.https.onCall(async(data, context) => {

  if(!context.auth.token) {
    return {
      status: "error"
    }
  }
  const id = data.id;
  const deck = data.board;
  let name = data.name;
  
  if(name === "") {
    name = "Board " + id;
  }
  if(check(deck)) {
  await database().ref("decks/"+ context.auth.uid + "/" + id).update({id: id, deck: deck, name:name});
  return {status: "ok"};
  }
  return {status: "error"};
});

function check(deck) {
  let valid = true;
  let place = 0;
  let counter = 35;
  let king = 0;
  deck.map((element) => {
    let x = element;
    if(place < 48 && x !== 0) {
      if(place >= 40 && x === 6) {
      }
      else {
        valid = false;
      }
    }
    switch(x) {
    case 1:
      king++;
    break
    case 2:
      counter = counter - 7;
    break
    case 3:
      counter = counter - 4;
    break
    case 4:
      counter = counter - 3;
    break
    case 5:
      counter = counter - 3;
    break
    case 6:
      counter = counter - 1;
    break
    case 7:
      counter = counter - 6;
    break
    case 8:
      counter = counter - 5;
    break
    case 9:
      counter = counter - 2;
    break
    default:
    }
    place++;
  });
  if(king === 1 && counter >= 0 && valid) {
    return true;
  }
  return false;
}


/*
exports.addDeck = functions.https.onCall(async(data, context) => {
  // Grab the text parameter.
  const id = data.id;
  const deck = data.board;
  // Push the new message into Firestore using the Firebase Admin SDK.
  await database().ref("decks/"+ context.auth.uid + "/" + id).update({id: id, deck: deck});
  //const writeResult = await admin.firestore().collection('messages').add({original: original});
  // Send back a message that we've successfully written the message
  return {
    text: "ok"
  };
});
*/
