import reset from "./css/reset.css";
import styles from "./css/styles.css";

import navbar from "./components/navbar/navbar.js";
import { getLibraryElement  } from "./components/library/library.js";

import Controller from "./controller.js";


(() => {
  const body = document.querySelector("body");

  const mainElement = document.createElement("main");
  const libraryElement = getLibraryElement();
  mainElement.appendChild(libraryElement)

  body.appendChild(navbar.getNavbarElement());
  body.appendChild(mainElement);

  const controller = new Controller();
  controller.getAuthStateObserver();    

  const signInBtn = navbar.getSignInBtn();
  signInBtn.addEventListener("click", e => {
    controller.signIn();
  })

})();