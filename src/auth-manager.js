import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut as authSignOut} from "firebase/auth";

import appManager from "./app-manager.js";
import controller from "./controllers/controller.js";


const authManager = (() => {

  const firebaseConfig = {
    apiKey: "AIzaSyC1jdymiNr6d_Y-WGj2jAHioWrUYrUTGcs",
    authDomain: "library-eb55f.firebaseapp.com",
    projectId: "library-eb55f",
    storageBucket: "library-eb55f.appspot.com",
    messagingSenderId: "404425878326",
    appId: "1:404425878326:web:c1e602083c874dd0932197",
    measurementId: "G-NBXHT6KEH0"
  };
  
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  /**
   * Signs in the user using the Firebase Auth.
   * 
   * Providers: Google
   */
  function signIn() {
    signInWithPopup(auth, provider)
      .then(result => {
        console.log("Sign in successful");
      }).catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        console.error("error", errorCode, errorMessage, email);
      });
  }

  /**
   * Signs out from the Firebase Auth.
   */
  function signOut() {
    authSignOut(auth)
      .then(() => {
        console.log("Sign out successful");
      }).catch(error => {
        console.log("error: sign out unsuccessful");
      });
  }

  function isUserSignedIn() {
    return auth.currentUser;
  }

  /**
   * Returns an auth state observer.
   * @returns an auth state observer
   */
  async function getAuthStateObserver() {
    return onAuthStateChanged(auth, async (user) => {
      controller.clearLibrary();
      await controller.retrieveBooks();
      if (user) {
        // user signed in
        appManager.showUserInfo(getProfilePicUrl());
      } else {
        // user not signed in
        appManager.hideUserInfo();
      }
    });
  }

  function getProfilePicUrl() {
    return auth.currentUser.photoURL;
  }

  function getUsername() {
    return auth.currentUser.displayName;
  }

  function getUserId() {
    return auth.currentUser.uid;
  }

  return {
    signIn,
    signOut,
    isUserSignedIn,
    getAuthStateObserver,
    getProfilePicUrl,
    getUsername,
    getUserId,
  };
})();


export default authManager;