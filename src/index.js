import reset from "./css/reset.css";
import styles from "./css/styles.css";

import navbar from "./components/navbar/navbar.js";

(() => {
  const body = document.querySelector("body");

  body.appendChild(navbar);

})();