import styles from "./styles.css";

const navbar = document.createElement("nav")

navbar.innerHTML = `
    <nav class="${styles.navbar}">
        <span class="${styles["nav-title"]}">Library</span>
        <button class="${styles["auth-btn"]} ${styles["sign-in-btn"]}" type="button">Sign In</button>
        <div class="${styles["signed-in-user-container"]}">
            <div class="${styles["profile-img"]}" hidden="true"></div>
            <button class="${styles["auth-btn"]} ${styles["sign-out-btn"]}" hidden="true">Sign Out</button>
        </div>
    </nav>
`;

export default navbar;