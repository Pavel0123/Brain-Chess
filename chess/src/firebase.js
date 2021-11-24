// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore,  connectFirestoreEmulator  } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider, connectAuthEmulator } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getDatabase, ref, onDisconnect, update, connectDatabaseEmulator } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
let firebaseConfig = {
  apiKey: "AIzaSyDUqicMID_wYl_XSJfmn4zSsciigGGnAOg",
  authDomain: "brain-chess.firebaseapp.com",
  databaseURL: "https://brain-chess-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "brain-chess",
  storageBucket: "brain-chess.appspot.com",
  messagingSenderId: "617179956917",
  appId: "1:617179956917:web:b48b04c64bccf7303260fc",
  measurementId: "G-KS4746NP7F"
}




// Initialize Firebase


const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const functions = getFunctions(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const db = getDatabase();

// eslint-disable-next-line no-restricted-globals
if(location.hostname === "localhost") {
  connectDatabaseEmulator(db, "localhost", 9000);
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(firestore, 'localhost', 8080);
  connectFunctionsEmulator(functions, "localhost", 5001);
}



//functions on auth change
export function login() {
  if(auth?.currentUser) {
  update(ref(db, "users/"+ auth?.currentUser?.uid), {
    name: auth?.currentUser?.displayName,
      email: auth?.currentUser?.email,
      state: "online"
  });
}
}

export function disconect() {
  if(auth?.currentUser) {
  const presenceRef = ref(db, "users/"+ auth?.currentUser?.uid);
  onDisconnect(presenceRef).update({
    state: "offline"
  });
}
}

export function logout() {
  if(auth?.currentUser) {
  update(ref(db, "users/"+ auth?.currentUser?.uid), {
    name: auth?.currentUser?.displayName,
      email: auth?.currentUser?.email,
      state: "offline"
  });
}
window.location.reload();
}

export function addDeck() {

}

export async function signIn() {
await signInWithPopup(auth, provider)
  .then((result) => {
    login();
    disconect();
    window.location.reload();
  });
}


export {firestore, auth, functions};
export default app;



