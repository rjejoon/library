import library from "./components/library/library.js";
import navbar from "./components/navbar/navbar.js";

const DOMManager = (() => {

  const body = document.querySelector("body");

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


  return {
    showUserInfo,
    hideUserInfo,
    addBookInLibraryGrid,
  };
})();

export default DOMManager;