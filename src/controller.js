import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

import navbar from "./components/navbar/navbar.js";


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
  // TODO make singleton

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

      }).catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        console.error("error", errorCode, errorMessage, email);
      });
  }

  signOut() {
    signOut(this.#auth)
      .then(() => {
        console.log("Sign out successful");
      }).catch(error => {
        console.log("error: sign out unsuccessful");
      })
  }

  getAuthStateObserver() {
    return onAuthStateChanged(this.#auth, user => {
      if (user) {
        // TODO refactor: controller should not access elements directly

        // user signed in
        navbar.getSignInBtn().setAttribute("hidden", "true");   // hide sign in button

        // show signed in user info
        navbar.getSignOutBtn().removeAttribute("hidden");   
        navbar.getProfileImageElement().removeAttribute("hidden");

        navbar.getProfileImageElement().style.backgroundImage = `url(${this.getProfilePicUrl()})`;

        // this.retrieveBooksFromDb();

      } else {
        // user not signed in
        navbar.getSignOutBtn().setAttribute("hidden", "true");   // hide sign out button
        navbar.getProfileImageElement().setAttribute("hidden", "true");

        navbar.getSignInBtn().removeAttribute("hidden")   // show sign in button

        // this.clearLibrary();
      }
    });
  }

  getProfilePicUrl() {
    // TODO add default profile picture
    return this.#auth.currentUser.photoURL;
  }

  getUsername() {
    return this.#auth.currentUser.displayName;
  }

  retrieveBooksFromDb() {

  }

  clearLibrary() {

  }
}
