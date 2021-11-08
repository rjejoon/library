import reset from "./css/reset.css";
import styles from "./css/styles.css";

import navbar from "./components/navbar/navbar.js";
import { getLibraryElement } from "./components/library/library.js";

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC1jdymiNr6d_Y-WGj2jAHioWrUYrUTGcs",
  authDomain: "library-eb55f.firebaseapp.com",
  projectId: "library-eb55f",
  storageBucket: "library-eb55f.appspot.com",
  messagingSenderId: "404425878326",
  appId: "1:404425878326:web:c1e602083c874dd0932197",
  measurementId: "G-NBXHT6KEH0"
};

(() => {
  const body = document.querySelector("body");

  const libraryElement = getLibraryElement();

  body.appendChild(navbar);
  body.appendChild(libraryElement);

  body.appendChild(getForm("add"));


  const app = initializeApp(firebaseConfig);









  function getForm(action="add") {

    // form type must be 'add' or 'update'
    if (!(action === "add" || action === "update")) {
      throw new Error("Invalid form type");
    }

    const bookForm = document.createElement("div");
    action = action[0].toUpperCase() + action.substring(1);

    bookForm.innerHTML = `<div class="${styles["book-form-background"]}">
      <form action="" class="${styles["book-form"]}">
        <div class="${styles["form-title"]}">${action} Book</div>
        <div class="${styles["form-items-container"]}">
          <label for="title">Title</label>
          <input type="text" class="${styles["input-title"]}" name="title">
          <label for="author">Author</label>
          <input type="text" class="${styles["input-author"]}" name="author">
          <label for="pages">Pages</label>
          <input type="number" class="${styles["input-pages"]}" name="pages" min="1">
          <div class="${styles["is-read-container"]}">
            <label for="is-read">Read?</label>
            <input type="checkbox" class="${styles["input-is-read"]}" name="is-read">
          </div>
        </div>
        <div class="${styles["book-form-submit-container"]}">
          <button class="${styles["book-form-submit-btn"]}" type="submit">${action}</button>
        </div>
      </form>
    </div>`;

    return bookForm;
  }

})();