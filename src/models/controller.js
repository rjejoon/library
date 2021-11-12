import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut as authSignOut} from "firebase/auth";
import { getFirestore, doc, collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, writeBatch, where, increment } from "firebase/firestore";

import DOMManager from "./dommanager.js";
import { Book } from "./book.js";
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
        clearLibrary();
        DOMManager.showUserInfo(getProfilePicUrl());

        retrieveBooksFromDb();

      } else {
        // user not signed in
        DOMManager.hideUserInfo();

        clearLibrary();
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

  function getNumTotalBooks() {
    return libraryList.length;
  }

  function getBookFromListAt(index) {
    return libraryList[index][1];
  }

  async function retrieveBooksFromDb() {
    const booksRef = collection(db, "users", getUserId(), "books");
    const q = query(booksRef, orderBy("index"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(doc => {
      const data = doc.data();

      const book = new Book(data.title, data.author, data.pages, data.isRead);
      const bookEle = library.createBookElement(book, data.index);
      
      libraryList.push([doc.id, book]);
      DOMManager.addBookInLibraryGrid(bookEle);
    });
  }

  function clearLibrary() {
    const numBooks = libraryList.length;
    libraryList.length = 0;   // clear list

    DOMManager.clearLibraryGrid(numBooks);
  }

  async function addBook(book, index) {

    try {
      const booksRef = collection(db, "users", getUserId(), "books");
      // Add a new book document with a generated id
      const bookRef = await addDoc(booksRef, { 
        ...book,
        index,
      });
      libraryList.push([bookRef.id, book]);
      console.log("Book document stored in db with id: ", bookRef.id);
    } catch (error) {
      console.error("Error: adding book doc in db failed", error);
    }
  }

  async function updateBook(updatedBook, index) {
    const book = libraryList[index][1];
    book.title = updatedBook.title;
    book.author = updatedBook.author;
    book.pages = updatedBook.pages;
    book.isRead = updatedBook.isRead;

    try {
      const bookRef = doc(db, "users", getUserId(), "books", libraryList[index][0]);
      await updateDoc(bookRef, { 
        ...updatedBook
      });
      console.log("Updated book successfuly with id: ", bookRef.id);
    } catch (error) {
      console.error("Error: updating book failed", error);
    }
  }

  async function deleteBook(index) {
    const targetBookId = libraryList[index][0];
    libraryList.splice(index, 1);     // delete element located at the given index

    deleteBookFromDb(targetBookId, index);
  }

  async function deleteBookFromDb(bookId, index) {
    try {
      await deleteDoc(doc(db, "users", getUserId(), "books", bookId));
      await shiftIndexesAfter(index);
      console.log("Successfully deleted book from db!");
    } catch (error) {
      console.error("Error: deleting book from db failed", error);
    }
  }

  async function shiftIndexesAfter(index) {

    const booksRef = collection(db, "users", getUserId(), "books");
    try {
      const q = query(booksRef, where("index", ">", parseInt(index)));
      const querySnapshot = await getDocs(q);
      // TODO refactor array
      const bookIds = [];
      querySnapshot.forEach(doc => {
        // shift index by -1
        bookIds.push(doc.id);
        console.log(doc.data());
      });
      for await (const bookId of bookIds) {
        const bookRef = doc(booksRef, bookId);
        await updateDoc(bookRef, { index: increment(-1) });
      }

    } catch (error) {
      console.error(error);
    }
  }

  return {
    signIn,
    signOut,
    getAuthStateObserver,
    getProfilePicUrl,
    getUsername,
    getUserId,
    getNumTotalBooks,
    getBookFromListAt,
    retrieveBooksFromDb,
    clearLibrary,
    addBook,
    updateBook,
    deleteBook,
  };

})();

export default controller;