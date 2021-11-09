import styles from "./styles.css";

const navbar = (() => {
  const navbarElement = document.createElement("nav")
  navbarElement.classList.add(styles.navbar);

  navbarElement.innerHTML = `
    <span class="${styles["nav-title"]}">Library</span>
    <button class="${styles["auth-btn"]} ${styles["sign-in-btn"]}" type="button">Sign In</button>
    <div class="${styles["signed-in-user-container"]}">
      <div class="${styles["profile-img"]}" hidden="true"></div>
      <button class="${styles["auth-btn"]} ${styles["sign-out-btn"]}" hidden="true">Sign Out</button>
    </div>`;

  function getNavbarElement() {
    return navbarElement;
  }

  function getSignInBtn() {
    return navbarElement.querySelector(`.${styles["sign-in-btn"]}`);
  }

  function getSignOutBtn() {
    return navbarElement.querySelector(`.${styles["sign-out-btn"]}`);
  }

  return {
    getNavbarElement,
    getSignInBtn,
    getSignOutBtn,
  }

})();

// export the navbar object 
export default navbar;