import styles from "./styles.css";

export function getLibraryElement() {
  const libraryElement = document.createElement("main");

  libraryElement.innerHTML = `
    <main class="${styles["library-grid"]}">
      <div class="${styles.book} ${styles["add-book"]}">
        <span class="${styles["material-icons"]}">add</span>
      </div>
    </main>
  `;

  return libraryElement;
}
