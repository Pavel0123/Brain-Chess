/* eslint-disable */
const functions = require("firebase-functions");
const {database} = require("firebase-admin");


exports.startGame = functions.database.ref("/queue/3 min")
    .onUpdate(async (result, context) => {
      const data = result.after.val();
      let player1;
      let player2;

      // eslint-disable-next-line guard-for-in
      for ( const key in data ) {
        if (!player1) {
          player1 = data[key];
        } else {
          player2 = data[key];
        }
      }

      //if 2 players in a queue start game
      if (player1 && player2) {
        //remove players from queue
        database().ref("queue/3 min/" + player1.uid).remove();
        database().ref("queue/3 min/" + player2.uid).remove();

        //get deck
        let deck1;
        await database().ref("decks/" + player1.uid + "/" + player1.deck)
            .get().then((result) => {
              const test = result.val();
              deck1 = test.deck;
            });

        let deck2;
        await database().ref("decks/" + player2.uid + "/" + player2.deck)
            .get().then((result) => {
              const test = result.val();
              deck2 = test.deck;
            });

        //create board 
        deck1 = deck1.reverse();
        let array = [];
        let counter = 0;
        deck1.map((element) => {
          if(counter < 32)  {
            array.push(element);
          }
          counter++;
        });
        counter = 0;
        deck2.map((element) => {
          if(counter >= 32)  {
            array.push(element + 10);
          }
          counter++;
        });

        //create game
         await database().ref("game/"+ Date.now())
            .update({playerWhite: player1.uid, playerBlack: player2.uid,
             deck: array, time: 300});
      }
    });
