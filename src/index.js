import reset from "./css/reset.css";
import styles from "./css/styles.css";

import navbar from "./components/navbar/navbar.js";
import library from "./components/library/library.js";

import controller from "./controller.js";


(() => {
  const body = document.querySelector("body");

  const mainElement = document.createElement("main");
  const libraryGrid = library.getLibraryGrid();
  mainElement.appendChild(libraryGrid);

  body.appendChild(navbar.getNavbarElement());
  body.appendChild(mainElement);

  controller.getAuthStateObserver();    

  const signInBtn = navbar.getSignInBtn();
  signInBtn.addEventListener("click", e => {
    controller.signIn();
  });

})();