const User = (function() {
  'use strict';

  const db = firebase.firestore();
  const libraryGrid = document.querySelector('.library-grid');
  const addBookEle = document.querySelector('.add-book');

  const addBookForm = document.querySelector('.add-book-form');
  const addBookFormBg = document.querySelector('.add-book-background');

  const updateBookForm = document.querySelector('.update-book-form');
  const updateBookFormBg = document.querySelector('.update-book-background');

  const signInBtn = document.querySelector('.sign-in-btn');
  const signedInUserContainer = document.querySelector('.signed-in-user-container');
  const signOutBtn = signedInUserContainer.querySelector('.sign-out-btn');
  const profileEle = signedInUserContainer.querySelector('.profile-img');

  function getCurrUser() {
    return firebase.auth().currentUser;
  }

  function getProfilePicUrl() {
    return getCurrUser().photoURL ?? '/images/profile_placeholder.jpeg';
  }

  function getUserName() {
    return getCurrUser().displayName;
  }

  function getUserId() {
    return getCurrUser().uid;
  }

  function signIn() {
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  }

  function signOut() {
    firebase.auth().signOut();
  }

  function authStateObserver(user) {
    if (user) {
      const profileUrl = getProfilePicUrl();
      const userName = getUserName();

      profileEle.style.backgroundImage = `url(${profileUrl})`;

      signInBtn.setAttribute('hidden', 'true');   // hide signin btn

      // show signed in user info
      signedInUserContainer.querySelector('.sign-out-btn').removeAttribute('hidden');
      profileEle.removeAttribute('hidden');

      retrieveBooksFromDb();
    }
    else {
      // hide signed in user info
      signedInUserContainer.querySelector('.sign-out-btn').setAttribute('hidden', 'true');
      profileEle.setAttribute('hidden', 'true');

      // show signin button
      signInBtn.removeAttribute('hidden');

      clearLibrary();
    }
  } 

  function retrieveBooksFromDb() {
    return db.collection('users').doc(getUserId())
      .collection('books').where('uid', '==', getUserId()).orderBy('index')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(doc => {
          const bookData = doc.data();
          const book = new Book(bookData.title, bookData.author, bookData.pages, bookData.isRead);
          const bookEle = createBookElement(book, bookData.index);
          libraryGrid.insertBefore(bookEle, addBookEle);
        });
      })
      .catch(error => {
        console.error("Error getting documents: ", error);
      });
  }


  return { getCurrUser, signIn, signOut, getProfilePicUrl, getUserName, getUserId };

})();

export default User;
