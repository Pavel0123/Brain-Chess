// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, onDisconnect, update } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const firebaseConfig = {
  apiKey: "AIzaSyDUqicMID_wYl_XSJfmn4zSsciigGGnAOg",
  authDomain: "brain-chess.firebaseapp.com",
  databaseURL: "https://brain-chess-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "brain-chess",
  storageBucket: "brain-chess.appspot.com",
  messagingSenderId: "617179956917",
  appId: "1:617179956917:web:b48b04c64bccf7303260fc",
  measurementId: "G-KS4746NP7F"
};

// Initialize Firebase


const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const db = getDatabase();




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
}

export async function signIn() {
await signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });

  await login();
  await disconect();

}


export {firestore, auth, app};
export default app;



