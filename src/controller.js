import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyC1jdymiNr6d_Y-WGj2jAHioWrUYrUTGcs",
  authDomain: "library-eb55f.firebaseapp.com",
  projectId: "library-eb55f",
  storageBucket: "library-eb55f.appspot.com",
  messagingSenderId: "404425878326",
  appId: "1:404425878326:web:c1e602083c874dd0932197",
  measurementId: "G-NBXHT6KEH0"
};

export default class Controller {

  #app;
  #auth;
  #provider;

  constructor() {
    this.#app = initializeApp(firebaseConfig);
    this.#auth = getAuth();
    this.#provider = new GoogleAuthProvider();
  }

  signIn() {
    signInWithPopup(this.#auth, this.#provider)
      .then(result => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(user);

      });
  }

  signOut() {
    this.#auth.signOut();
  }
}
