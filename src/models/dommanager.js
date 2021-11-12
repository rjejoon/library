import library from "../components/library/library.js";
import navbar from "../components/navbar/navbar.js";
import controller from "./controller.js";

const DOMManager = (() => {

  const body = document.querySelector("body");

  function createApp() {
    const mainElement = document.createElement("main");
    const libraryGrid = library.getLibraryGrid();
    mainElement.appendChild(libraryGrid);

    body.appendChild(navbar.getNavbarElement());
    body.appendChild(mainElement);

    navbar.getSignInBtn().addEventListener("click", e => {
      controller.signIn();
    });
    navbar.getSignOutBtn().addEventListener("click", e => {
      controller.signOut();
    });
  }

  function showUserInfo(profilePicURL) {

    navbar.getSignInBtn().setAttribute("hidden", "true");   // hide sign in button

    // show signed in user info
    navbar.getSignOutBtn().removeAttribute("hidden");   
    navbar.getProfileImageElement().removeAttribute("hidden");
    navbar.getProfileImageElement().style.backgroundImage = `url(${profilePicURL})`;
  }

  function hideUserInfo() {
    navbar.getSignOutBtn().setAttribute("hidden", "true");   // hide sign out button
    navbar.getProfileImageElement().setAttribute("hidden", "true");

    navbar.getSignInBtn().removeAttribute("hidden")   // show sign in button
  }

  function addBookInLibraryGrid(bookEle) {
    library.getLibraryGrid().insertBefore(bookEle, library.getAddBookElement());

  }

  function clearLibraryGrid(numBooks) {
    const libraryGrid = library.getLibraryGrid();
    
    for (let i=0; i<numBooks; i++) {
      libraryGrid.removeChild(libraryGrid.firstElementChild);
    }
  }

  function updateBookInLibraryGrid(index) {
    const updatedBook = controller.getBookFromListAt(index);

    library.getTitleElementOfBookAt(index).textContent = updatedBook.title;
    library.getAuthorElementOfBookAt(index).textContent = updatedBook.author;
    library.getPagesElementOfBookAt(index).textContent = `${updatedBook.pages} pages`;
    library.updateIsReadOfBookAt(index, updatedBook.isRead);
  }

  function deleteBookElement(bookEle, index) {
    library.getLibraryGrid().removeChild(bookEle);    // remove target book element

    const bookElements = library.getAllBookElements();

    // update indexes of book elements after the target book element
    for (let i=index; i<bookElements.length-1; i++) {
      bookElements[i].dataset["index"]--;    
    }
  }

  return {
    createApp,
    showUserInfo,
    hideUserInfo,
    addBookInLibraryGrid,
    clearLibraryGrid,
    updateBookInLibraryGrid,
    deleteBookElement,
  };
})();

export default DOMManager;