import reset from "./css/reset.css";
import styles from "./css/styles.css";

import navbar from "./components/navbar/navbar.js";
import library from "./components/library/library.js";

import controller from "./models/controller.js";
import DOMManager from "./models/dommanager";


DOMManager.createApp();
controller.getAuthStateObserver();    