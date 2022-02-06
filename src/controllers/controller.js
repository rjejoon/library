import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, writeBatch, where, increment } from "firebase/firestore";

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

  function getNumTotalBooks() {
    return library.getLength();
  }

  function getBookIdAt(index) {
    return library.getBookIdAt(index);
  }

  function getBookAt(index) {
    return library.getBookAt(index)
  }

  async function retrieveBooksFromDb() {
    const booksRef = collection(db, "users", authManager.getUserId(), "books");
    const q = query(booksRef, orderBy("index"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(doc => {
      const data = doc.data();
      const book = new Book(data.title, data.author, data.pages, data.isRead);
      
      library.push(doc.id, book);
    });
  }

  function clearLibrary() {
    library.clear();
  }

  async function addBook(book, index) {
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
  }

  async function updateBook(updatedBook, index) {
    const book = getBookAt(index);
    book.title = updatedBook.title;
    book.author = updatedBook.author;
    book.pages = updatedBook.pages;
    book.isRead = updatedBook.isRead;

    library.replaceBookAt(index, updatedBook);
    try {
      const bookRef = doc(db, "users", authManager.getUserId(), "books", getBookIdAt(index));
      await updateDoc(bookRef, { 
        ...updatedBook
      });
      console.log("Updated book successfuly with id: ", bookRef.id);
    } catch (error) {
      console.error("Error: updating book failed", error);
    }
  }

  async function deleteBook(index) {
    const targetBookId = getBookIdAt(index);
    library.deleteAt(index);
    deleteBookFromDb(targetBookId, index);
  }

  async function deleteBookFromDb(bookId, index) {
    try {
      await deleteDoc(doc(db, "users", authManager.getUserId(), "books", bookId));
      await shiftIndexesAfter(index);
      console.log("Successfully deleted book from db!");
    } catch (error) {
      console.error("Error: deleting book from db failed", error);
    }
  }

  async function shiftIndexesAfter(index) {

    const booksRef = collection(db, "users", authManager.getUserId(), "books");
    try {
      const q = query(booksRef, where("index", ">", parseInt(index)));
      const querySnapshot = await getDocs(q);
      // TODO refactor array
      const bookIds = [];
      querySnapshot.forEach(doc => {
        // shift index by -1
        bookIds.push(doc.id);
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
    getNumTotalBooks,
    getBookIdAt,
    getBookAt,
    retrieveBooksFromDb,
    clearLibrary,
    addBook,
    updateBook,
    deleteBook,
  };

})();

export default controller;