import libraryGrid from "./components/library/library-grid.js";
import navbar from "./components/navbar/navbar.js";
import authManager from "./auth-manager.js";


const appManager = (() => {

  const body = document.querySelector("body");

  /**
   * On called, it generates the DOM elements for the app.
   */
  function createApp() {
    const mainElement = document.createElement("main");
    mainElement.appendChild(libraryGrid.getLibraryGrid());

    body.appendChild(navbar.getNavbarElement());
    body.appendChild(mainElement);

    navbar.getSignInBtn().addEventListener("click", e => {
      authManager.signIn();
    });
    navbar.getSignOutBtn().addEventListener("click", e => {
      authManager.signOut();
    });

    authManager.getAuthStateObserver();    
  }

  /**
   * Reveals the user information in the navbar.
   * 
   * @param {string} profilePicURL 
   */
  function showUserInfo(profilePicURL) {

    navbar.getSignInBtn().setAttribute("hidden", "true");   // hide sign in button

    // show signed in user info
    navbar.getSignOutBtn().removeAttribute("hidden");   
    navbar.getProfileImageElement().removeAttribute("hidden");
    navbar.getProfileImageElement().style.backgroundImage = `url(${profilePicURL})`;
  }

  /**
   * Hides the user information from the navbar.
   */
  function hideUserInfo() {
    navbar.getSignOutBtn().setAttribute("hidden", "true");   // hide sign out button
    navbar.getProfileImageElement().setAttribute("hidden", "true");
    navbar.getSignInBtn().removeAttribute("hidden")   // show sign in button
  }

  return {
    createApp,
    showUserInfo,
    hideUserInfo,
  };
})();

export default appManager;