const functions = require("firebase-functions");
const { database } = require("firebase-admin");

exports.playTurn = functions.https.onCall(async(data, context) => {
  if(!context.auth.token) {
    return {
      status: "error"
    }
  }
  const game = data.game
  const from = data.from;
  const to = data.to;
  let turns;

  await database().ref("game/" + game + "/")
            .get().then((result) => {
              const test = result.val();
              turns = test.turns;
  });
  
  let counter = 0;
  for ( const key in turns ) {
    counter++;
  }
            
  await database().ref("game/"+ game + "/turns/" + counter).update({from: from, to: to});
  return {
    status: "ok"
  };
});
