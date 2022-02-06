import styles from "./styles.css";

import controller from "../../controllers/controller";
import { Book } from "../../models/book";

const libraryGrid = (() => {

  const grid = document.createElement("div");
  grid.classList.add(styles["library-grid"]);

  grid.innerHTML = `
    <div class="${styles.book} ${styles["add-book"]}">
      <span class="material-icons ${styles["add-book-icon"]}">add</span>
    </div>
  `;

  // display add book form when add book element is clicked
  const addBookElement = grid.querySelector(`.${styles["add-book"]}`);
  addBookElement.addEventListener("click", e => {
    const body = document.querySelector("body");
    body.appendChild(getFormElement("add"));
  });

  function getLibraryGrid() {
    return grid;
  }

  function getAddBookElement() {
    return addBookElement;
  }

  function getBookElementAt(index) {
    return grid.querySelector(`.${styles.book}[data-index="${index}"]`);
  }

  function getTitleElementOfBookAt(index) {
    return getBookElementAt(index).querySelector(`.${styles.title}`);
  }

  function getAuthorElementOfBookAt(index) {
    return getBookElementAt(index).querySelector(`.${styles.author}`);
  }

  function getPagesElementOfBookAt(index) {
    return getBookElementAt(index).querySelector(`.${styles.pages}`);
  }

  function getAllBookElements() {
    return grid.querySelectorAll(`.${styles.book}`);
  }

  function setIsReadOfBookAt(index, isRead) {
    const doneIcon = getBookElementAt(index).querySelector(`.${styles["done-icon"]}`);
    if (isRead) {
      doneIcon.classList.add(styles["done-read"]);
    } else {
      doneIcon.classList.remove(styles["done-read"]);
    }
  }

  function addBookElementAt(book, index) {
    grid.insertBefore(createBookElement(book, index), addBookElement);
  }

  function updateBookElementAt(index, updatedBook) {
    getTitleElementOfBookAt(index).textContent = updatedBook.title;
    getAuthorElementOfBookAt(index).textContent = updatedBook.author;
    getPagesElementOfBookAt(index).textContent = `${updatedBook.pages} pages`;
    setIsReadOfBookAt(index, updatedBook.isRead);
  }

  function deleteBookElementAt(index) {
    grid.removeChild(getBookElementAt(index));    // remove target book element

    // update indexes of book elements after the target book element
    const bookElements = getAllBookElements();
    for (let i=index; i<bookElements.length-1; i++) {
      --bookElements[i].dataset["index"];    
    }
  }

  function clearGrid() {
    for (let bookEle=grid.firstElementChild; bookEle!=addBookElement; bookEle=grid.firstElementChild) {
      grid.removeChild(bookEle);
    }
  }

  function createBookElement({ title, author, pages, isRead }, index) {
    const bookEle = document.createElement("div");
    bookEle.classList.add(styles.book, styles["hover-icon"]);
    bookEle.dataset["index"] = index;

    const bookInfoContainer = document.createElement("div");
    bookInfoContainer.classList.add(styles["book-info-container"]);

    const titleEle = document.createElement("span");
    titleEle.classList.add(styles.title);
    titleEle.textContent = title;

    const authorEle = document.createElement("span");
    authorEle.classList.add(styles.author);
    authorEle.textContent = author;

    const pagesEle = document.createElement("span");
    pagesEle.classList.add(styles.pages);
    pagesEle.textContent = `${pages} pages`;

    const btnContainer = document.createElement("div");
    btnContainer.classList.add(styles["button-container"]);
    btnContainer.innerHTML = `
        <span class="material-icons ${styles["done-icon"]} ${isRead ? styles["done-read"] : ""}">done</span>
        <span class="material-icons ${styles["del-book-icon"]}">delete_outline</span>`;
      
    bookInfoContainer.appendChild(titleEle);
    bookInfoContainer.appendChild(authorEle);
    bookInfoContainer.appendChild(pagesEle);
    bookInfoContainer.appendChild(btnContainer);

    bookEle.appendChild(bookInfoContainer);

    // add event listeners
    bookEle.addEventListener("mouseenter", e => {
      bookEle.querySelector(`.${styles["button-container"]}`).classList.add(styles.visible);
    });
    bookEle.addEventListener("mouseleave", e => {
      bookEle.querySelector(`.${styles["button-container"]}`).classList.remove(styles.visible);
    });
    bookEle.addEventListener("click", e => {
      // create update form element
      if (!e.target.classList.contains("material-icons")) {
        // create form when on clicked anywhere other than buttons
        const formEle = getFormElement("update");
        const form = formEle.querySelector(`.${styles["book-form"]}`);

        // TODO refactor
        const book = controller.getBookAt(index);
        form.elements[0].value = book.title;
        form.elements[1].value = book.author;
        form.elements[2].value = book.pages;
        form.elements[3].checked = book.isRead;
        form.dataset["index"] = index    // save current index

        const body = document.querySelector("body");
        body.appendChild(formEle);
      }
    });
    bookEle.querySelector(`.${styles["done-icon"]}`).addEventListener("click", e => {
      // TODO update isRead
    });
    bookEle.querySelector(`.${styles["del-book-icon"]}`).addEventListener("click", e => {
      // TODO delete book in db and list
      const index = bookEle.dataset["index"];
      controller.deleteBook(index);
    });

    return bookEle;
  }

  function getFormElement(action="add") {

    // form type must be 'add' or 'update'
    if (!(action === "add" || action === "update")) {
      throw new Error("Invalid form type");
    }
    action = action[0].toUpperCase() + action.substring(1);

    const bookForm = document.createElement("div");
    bookForm.classList.add(styles["book-form-background"]);

    bookForm.innerHTML = `<form action="" class="${styles["book-form"]}">
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
      </form>`;

    bookForm.addEventListener("click", e => {
      // remove form only if the background is clicked
      if (e.target.classList.contains(styles["book-form-background"])) {
        const body = document.querySelector("body");
        body.removeChild(bookForm);
      }
    });

    bookForm.querySelector(`.${styles["book-form-submit-btn"]}`).addEventListener("click", e => {
      e.preventDefault();

      // TODO input validation

      // get book info from form
      const form = bookForm.querySelector(`.${styles["book-form"]}`);
      const title = form.elements[0].value;
      const author = form.elements[1].value;
      const pages = form.elements[2].value;
      const isRead = form.elements[3].checked;
      const book = new Book(title, author, pages, isRead);

      if (action.toLowerCase() == "add") {
        // add book
        const index = controller.getNumTotalBooks();
        controller.addBook(book, index);
      } else {
        // update book
        const index = form.dataset["index"];
        controller.updateBook(book, index);
      }

      document.querySelector("body").removeChild(bookForm);   // remove form from the dom
    });
    return bookForm;
  }

  return {
    getLibraryGrid,
    addBookElementAt,
    updateBookElementAt,
    deleteBookElementAt,
    clearGrid,
  }
})();


export default libraryGrid;