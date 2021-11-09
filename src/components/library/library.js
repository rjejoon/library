import styles from "./styles.css";

export function getLibraryElement() {
  const libraryElement = document.createElement("div");
  libraryElement.classList.add(styles["library-grid"]);

  libraryElement.innerHTML = `
    <div class="${styles.book} ${styles["add-book"]}">
      <span class="material-icons ${styles["add-book-icon"]}">add</span>
    </div>
  `;

  // display add book form when add book element is clicked
  const addBookElement = libraryElement.querySelector(`.${styles["add-book"]}`)
  addBookElement.addEventListener("click", e => {
  const body = document.querySelector("body");
  body.appendChild(getFormElement("add"));
  });

  return libraryElement;
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
