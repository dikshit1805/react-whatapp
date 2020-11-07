import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBW63ZBb9_xlemtVdHINYOWUfHJtYcnmYM",
  authDomain: "whatsappclone-57ba8.firebaseapp.com",
  databaseURL: "https://whatsappclone-57ba8.firebaseio.com",
  projectId: "whatsappclone-57ba8",
  storageBucket: "whatsappclone-57ba8.appspot.com",
  messagingSenderId: "898400120059",
  appId: "1:898400120059:web:05123c535ec9c61c13145e"
};


firebase.initializeApp(firebaseConfig);
const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider();

export {auth, provider};