const functions = require("firebase-functions");
const { database } = require("firebase-admin");

exports.addQueue = functions.https.onCall(async(data, context) => {
  if(!context.auth.token) {
    return {
      status: "error"
    }
  }
  const type = data.type;
  const deck = data.board;
  await database().ref("queue/"+ type + "/" + context.auth.uid).update({uid: context.auth.uid, deck: deck});
  return {
    status: "ok"
  };
});


exports.removeQueue = functions.https.onCall(async(data, context) => {
  if(!context.auth.token) {
    return {
      status: "error"
    }
  }
  await database().ref("queue/3 min/" + context.auth.uid).remove();
  await database().ref("queue/10 min/" + context.auth.uid).remove();
  return {
    status: "ok"
  };
});
