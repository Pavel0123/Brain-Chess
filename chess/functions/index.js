const admin = require("firebase-admin");
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


exports.deck = require("./game/addDeck");
exports.add = require("./game/queue");
exports.play = require("./game/play");

exports.trigger = require("./triggers/QueueTrigger");
