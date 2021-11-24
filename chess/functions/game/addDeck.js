const functions = require("firebase-functions");
const { database } = require("firebase-admin");

exports.addDeck = functions.https.onCall(async(data, context) => {
  if(!context.auth.token) {
    return {
      status: "error"
    }
  }
  const id = data.id;
  const deck = data.board;
  await database().ref("decks/"+ context.auth.uid + "/" + id).update({id: id, deck: deck});
  return {
    status: "ok"
  };
});

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
