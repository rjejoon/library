import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection, query, orderBy, limit, getDocs, addDoc, updateDoc, deleteDoc, writeBatch, where, increment } from "firebase/firestore";

import { Book } from "../models/book.js";
import library from "../models/library.js";

import authManager from "../auth-manager.js";


const controller = (() => {

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
  const myStorage = window.localStorage;
  let isOnDelete = false;

  function getNumTotalBooks() {
    return library.getLength();
  }

  function getBookIdAt(index) {
    return library.getBookIdAt(index);
  }

  function getBookAt(index) {
    return library.getBookAt(index)
  }

  /**
   * Retrieves the user's all Book objects from the Firestore and stores them in the library.
   */
  async function retrieveBooks() {
  
    if (authManager.isUserSignedIn()) {
      await migrateLocalStorage();
      const booksRef = collection(db, "users", authManager.getUserId(), "books");
      const q = query(booksRef, orderBy("index"));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(doc => {
        const data = doc.data();
        const book = new Book(data.title, data.author, data.pages, data.isRead);
        
        library.push(doc.id, book);
      });
    } else {
      for (let i=0; i<myStorage.length; i++) {
        const book = JSON.parse(myStorage.getItem(`book${i}`));
        library.push(book, i);
      }
    }
  }

  /**
   * If there is one or more Book objects in the LocalStorage, store them
   * into the user's database storage.
   * The LocalStorage is then cleared.
   */
  async function migrateLocalStorage() {
    const tempLibrary = [];
    for (let i=0; i<myStorage.length; i++) {
      const book = JSON.parse(myStorage.getItem(`book${i}`));
      tempLibrary.push(book);
    }
    myStorage.clear();

    // get the last index in db
    let lastIndex = -1;
    const booksRef = collection(db, "users", authManager.getUserId(), "books");
    const q = query(booksRef, orderBy("index", "desc"), limit(1));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      lastIndex = doc.data().index;
    });
    lastIndex++;

    // add books in LocalStorage into db
    for await (const book of tempLibrary) {
      try {
        const bookRef = await addDoc(booksRef, { 
          ...book,
          index: lastIndex,
        });
        console.log("Book document stored in db with id: ", bookRef.id);
      } catch (error) {
        console.error("Error: adding book doc in db failed", error);
      }
      lastIndex++;
    }
  }

  function clearLibrary() {
    library.clear();
  }

  /**
   * Adds the Book object into the library and the Firestore database.
   * 
   * @param {Book} book 
   * @param {number} index 
   */
  async function addBook(book, index) {
    if (authManager.isUserSignedIn()) {
      try {
        const booksRef = collection(db, "users", authManager.getUserId(), "books");

        // Add a new book document with a generated id
        const bookRef = await addDoc(booksRef, { 
          ...book,
          index,
        });
        library.push(bookRef.id, book);
        console.log("Book document stored in db with id: ", bookRef.id);
      } catch (error) {
        console.error("Error: adding book doc in db failed", error);
      }
    } else {
      myStorage.setItem(`book${index}`, JSON.stringify(book));
      library.push(index, book);
    }
  }

  /**
   * Updates the old Book object located at the index with the given updated Book object.
   * The Firestore database is also updated accordingly.
   * 
   * @param {Book} updatedBook 
   * @param {number} index 
   */
  async function updateBook(updatedBook, index) {

    library.replaceBookAt(index, updatedBook);

    if (authManager.isUserSignedIn()) {
      try {
        const bookRef = doc(db, "users", authManager.getUserId(), "books", getBookIdAt(index));
        await updateDoc(bookRef, { 
          ...updatedBook
        });
        console.log("Updated book successfuly with id: ", bookRef.id);
      } catch (error) {
        console.error("Error: updating book failed", error);
      }
    } else {
      myStorage.setItem(`book${index}`, JSON.stringify(updatedBook));
    }
  }

  /**
   * Deletes a Book object located at the index from the list and the Firestore database.
   * Updates the indexes of the books located after the target index in the Firestore database.
   * 
   * @param {number} index - pos of the Book object to delete
   */
  async function deleteBook(index) {
    if (!isOnDelete) {
      isOnDelete = true;
      if (authManager.isUserSignedIn()) {
        try {
          const bookId = getBookIdAt(index);
          await deleteDoc(doc(db, "users", authManager.getUserId(), "books", bookId));
          await shiftIndexesAfter(index);
          console.log("Successfully deleted book from db!");
        } catch (error) {
          console.error("Error: deleting book from db failed", error);
        }
      } else {
        myStorage.removeItem(`book${index}`);
        await shiftIndexesAfter(index);
      }
      library.deleteAt(index);
      isOnDelete = false;
    }
  }

  /**
   * Shifts the indexes in the range "index" < i < total number of books by -1.
   * 
   * @param {number} index 
   */
  async function shiftIndexesAfter(index) {

    if (authManager.isUserSignedIn()) {
      const booksRef = collection(db, "users", authManager.getUserId(), "books");
      try {
        const q = query(booksRef, where("index", ">", parseInt(index)));
        const querySnapshot = await getDocs(q);
        const bookIds = [];
        querySnapshot.forEach(doc => {
          bookIds.push(doc.id);
        });
        for await (const id of bookIds) {
          const bookRef = doc(booksRef, id);
          await updateDoc(bookRef, { index: increment(-1) });
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      for (let i=index+1; i<getNumTotalBooks(); i++) {
        const book = myStorage.getItem(`book${i}`);
        myStorage.removeItem(`book${i}`);
        myStorage.setItem(`book${i-1}`, book);
      }
    }
  }

  return {
    getNumTotalBooks,
    getBookIdAt,
    getBookAt,
    retrieveBooks,
    clearLibrary,
    migrateLocalStorage,
    addBook,
    updateBook,
    deleteBook,
  };
})();

export default controller;