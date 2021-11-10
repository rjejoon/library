import styles from "./styles.css";

const library = (() => {

  const libraryGrid = document.createElement("div");
  libraryGrid.classList.add(styles["library-grid"]);

  libraryGrid.innerHTML = `
    <div class="${styles.book} ${styles["add-book"]}">
      <span class="material-icons ${styles["add-book-icon"]}">add</span>
    </div>
  `;

  // display add book form when add book element is clicked
  const addBookElement = libraryGrid.querySelector(`.${styles["add-book"]}`)
  addBookElement.addEventListener("click", e => {
    const body = document.querySelector("body");
    body.appendChild(getFormElement("add"));
  });

  function getLibraryGrid() {
    return libraryGrid;
  }

  function getAddBookElement() {
    return libraryGrid.querySelector(`.${styles["add-book"]}`);
  }

  function createBookElement({ title, author, pages, isRead }, index) {
    const bookEle = document.createElement("div");
    bookEle.classList.add(styles.book);
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
        <span class="material-icons ${styles["done-icon"]} ${isRead ? "done-read" : ""}">done</span>
        <span class="material-icons ${styles["del-book-icon"]}">delete_outline</span>`;
      
    bookInfoContainer.appendChild(titleEle);
    bookInfoContainer.appendChild(authorEle);
    bookInfoContainer.appendChild(pagesEle);
    bookInfoContainer.appendChild(btnContainer);

    bookEle.appendChild(bookInfoContainer);

    // add event listeners
    bookEle.addEventListener("mouseenter", e => {
      this.querySelector(`.${styles["button-container"]}`).classList.add(styles.visible);
    });
    bookEle.addEventListener("mouseleave", e => {
      this.querySelector(`.${styles["button-container"]}`).classList.remove(styles.visible);
    });
    bookEle.addEventListener("click", e => {
      // create update form element
      if (!e.target.classList.contains("material-icons")) {
        // create form when on clicked anywhere other than buttons
        const formEle = getFormElement("update");

        formEle.elements[0].value = title;
        formEle.elements[1].value = author;
        formEle.elements[2].value = pages;
        formEle.elements[3].checked = isRead;
        formEle.dataset["index"] = index    // save current index
      }
    });
    bookEle.querySelector(`.${styles["done-icon"]}`).addEventListener("click", e => {
      // TODO update isRead
    });
    bookEle.querySelector(`.${styles["del-book-icon"]}`).addEventListener("click", e => {
      // TODO delete book in db and list
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

    // remove itself if the background is clicked
    bookForm.addEventListener("click", e => {
      const body = document.querySelector("body");
      body.removeChild(bookForm);
    });

    return bookForm;
  }

  return {
    getLibraryGrid,
    getAddBookElement,
    createBookElement,
  }
})();


export default library;