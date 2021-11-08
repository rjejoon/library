import reset from "./css/reset.css";
import styles from "./css/styles.css";

import navbar from "./components/navbar/navbar.js";

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC1jdymiNr6d_Y-WGj2jAHioWrUYrUTGcs",
  authDomain: "library-eb55f.firebaseapp.com",
  projectId: "library-eb55f",
  storageBucket: "library-eb55f.appspot.com",
  messagingSenderId: "404425878326",
  appId: "1:404425878326:web:c1e602083c874dd0932197",
  measurementId: "G-NBXHT6KEH0"
};

(() => {
  const body = document.querySelector("body");

  body.appendChild(navbar);

  const app = initializeApp(firebaseConfig);
})();