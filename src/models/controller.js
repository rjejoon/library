import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut as authSignOut} from "firebase/auth";
import { getFirestore, doc, collection, query, orderBy, getDocs } from "firebase/firestore";

import DOMManager from "./dommanager.js";
import { Book, bookConverter } from "./book.js";
import library from "../components/library/library.js";


const controller = (() => {

  const libraryList = [];

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
  const db = getFirestore();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

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

  function signOut() {
    authSignOut(auth)
      .then(() => {
        console.log("Sign out successful");
      }).catch(error => {
        console.log("error: sign out unsuccessful");
      })
  }

  async function getAuthStateObserver() {
    return onAuthStateChanged(auth, user => {
      if (user) {
        // user signed in
        DOMManager.showUserInfo(getProfilePicUrl());

        retrieveBooksFromDb();

      } else {
        // user not signed in
        DOMManager.hideUserInfo();

        // this.clearLibrary();
      }
    });
  }

  function getProfilePicUrl() {
    // TODO add default profile picture
    return auth.currentUser.photoURL;
  }

  function getUsername() {
    return auth.currentUser.displayName;
  }

  function getUserId() {
    return auth.currentUser.uid;
  }

  async function retrieveBooksFromDb() {
    const booksRef = collection(db, "users", getUserId(), "books").withConverter(bookConverter);
    const q = query(booksRef, orderBy("index"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc, index) => {
      const book = doc.data();
      const bookEle = library.createBookElement(book, index);
      
      libraryList.push(book);
      DOMManager.addBookInLibraryGrid(bookEle);
    });
  }

  async function clearLibrary() {

  }

  return {
    signIn,
    signOut,
    getAuthStateObserver,
    getProfilePicUrl,
    getUsername,
    getUserId,
    retrieveBooksFromDb,
    clearLibrary,
  };

})();

export default controller;