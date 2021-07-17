import Book from './modules/Book.js';
import User from './modules/User.js';

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


window.addEventListener('DOMContentLoaded', e => {

  addBookEle.addEventListener('mouseenter', addBookEnterHandler);
  addBookEle.addEventListener('mouseleave', addBookLeaveHandler);
  addBookEle.addEventListener('click', addBookClickHandler);

  addBookForm.addEventListener('submit', addBookToLibraryGrid);
  addBookFormBg.addEventListener('click', addBookFormBgClickHandler);

  updateBookForm.addEventListener('submit', updateBook);
  updateBookFormBg.addEventListener('click', updateBookFormBgClickHandler);

  signInBtn.addEventListener('click', User.signIn);
  signOutBtn.addEventListener('click', User.signOut);

});

initFirebaseAuth();


function initFirebaseAuth() {
  firebase.auth().onAuthStateChanged(authStateObserver);
}

function authStateObserver(user) {
  if (user) {
    const profileUrl = User.getProfilePicUrl();
    const userName = User.getUserName();

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
  const uid = User.getUserId();

  return db.collection('users').doc(uid)
    .collection('books').where('uid', '==', uid).orderBy('index')
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

// App
function dbSaveBook(user, book, index) {
  saveUser(user);
  const uid = User.getUserId();
  const bookId = book.getBookId();   

  return db.collection('users').doc(uid).collection('books').doc(bookId).set({ 
      ...book, 
      index,
      uid: User.getUserId(),
    }).catch(error => console.error('Error writing new book to database', error));
}

// User
function saveUser(user) {
  return firebase.firestore().collection('users').doc(User.getUserId()).set({
    username: user.displayName,
    email: user.email,
    profileUrl: user.photoURL
  }).catch(error => console.error("Unable to save user", error));
}


// App
function clearLibrary() {
  const books = libraryGrid.querySelectorAll('.book');

  // remove all books except for add book
  for (let i=0; i<books.length-1; i++) {
    libraryGrid.removeChild(libraryGrid.firstElementChild);
  }
}

// App
function addBookToLibraryGrid(event) {

  event.preventDefault();       // event: submit

  const title = this.elements[0].value;
  const author = this.elements[1].value;
  const pages = this.elements[2].value;
  const isRead = this.elements[3].checked;
  const index = getFirstFreeBookIndex();

  const book = new Book(title, author, pages, isRead);

  const bookEle = createBookElement(book, index);
  libraryGrid.insertBefore(bookEle, addBookEle);
  dbSaveBook(User.getCurrUser(), book, index);

  addBookFormBg.classList.remove('add-book-background-visible');  // hide add book form
}

// App
function getFirstFreeBookIndex() {
  return libraryGrid.querySelectorAll('.book').length - 1;     // exclude add book element
}

// App
function updateBook(event) {

  event.preventDefault();

  const title = this.elements[0].value;
  const author = this.elements[1].value;
  const pages = this.elements[2].value;
  const isRead = this.elements[3].checked;
  const index = this.dataset['index'];

  const targetBookElement = libraryGrid.querySelector(`.book[data-index="${index}"]`)
  const originalBook = Book.createBookFromBookElement(targetBookElement);
  const updatedBook = new Book(title, author, pages, isRead);

  updateBookElement(targetBookElement, updatedBook);
  updateBookFormBg.classList.remove('update-book-background-visible');  // hide update book form

  dbBookUpdate(User.getCurrUser(), originalBook, updatedBook, index);
}


// App, maybe BookElement
function updateBookElement(targetBookElement, updatedBook) {

  targetBookElement.querySelector('.title').textContent = updatedBook.title;
  targetBookElement.querySelector('.author').textContent = updatedBook.author;
  targetBookElement.querySelector('.pages').textContent = `${updatedBook.pages} pages`;
  if (updatedBook.isRead) {
    targetBookElement.querySelector('.done-icon').classList.add('done-read');
  }
}

// App
function dbBookUpdate(user, originalBook, updatedBook, index) {

  const userRef = db.collection('users').doc(User.getUserId());
  const bookRef = userRef.collection('books').doc(originalBook.getBookId());

  return bookRef.delete()
    .then(dbSaveBook(user, updatedBook, index))      // delete then add the new book
    .catch(error => console.error("Error: book document update failed", error));
}

// BookElement
function createBookElement({ title, author, pages, isRead }, index) {
  const bookEle = document.createElement('div');
  bookEle.classList.add('book')
  bookEle.dataset['index'] = index;

  const bookInfoContainer = document.createElement('div');
  bookInfoContainer.classList.add('book-info-container');

  const titleEle = document.createElement('span');
  titleEle.classList.add('title');
  titleEle.textContent = title;

  const authorEle = document.createElement('span');
  authorEle.classList.add('author');
  authorEle.textContent = author;

  const pagesEle = document.createElement('span');
  pagesEle.classList.add('pages');
  pagesEle.textContent = `${pages} pages`;

  const btnContainer = document.createElement('div');
  btnContainer.classList.add('button-container');
  btnContainer.innerHTML = `
      <span class="material-icons done-icon ${isRead ? "done-read" : ""}">done</span>
      <span class="material-icons del-book-icon">delete_outline</span>`;

  bookInfoContainer.appendChild(titleEle);
  bookInfoContainer.appendChild(authorEle);
  bookInfoContainer.appendChild(pagesEle);
  bookInfoContainer.appendChild(btnContainer);
  
  bookEle.appendChild(bookInfoContainer);
  addBookElementEvents(bookEle);

  return bookEle;
}

// BookElement
function addBookElementEvents(bookEle) {
  bookEle.addEventListener('mouseenter', bookEnterHandler);
  bookEle.addEventListener('mouseleave', bookLeaveHandler);
  bookEle.addEventListener('click', toggleUpdateForm);
  bookEle.querySelector('.done-icon').addEventListener('click', isReadClickHandler); 
  bookEle.querySelector('.del-book-icon').addEventListener('click', deleteBook);
}

// BookElement
function bookEnterHandler(event) {
  this.querySelector('.button-container').classList.add('visible');
}

// BookElement
function bookLeaveHandler(event) {
  this.querySelector('.button-container').classList.remove('visible');
}

// BookElement 
function toggleUpdateForm(event) {

  if (!event.target.classList.contains('material-icons')) {       // toggle form when clicked anywhere other than buttons
    updateBookFormBg.classList.add('update-book-background-visible');

    const book = Book.createBookFromBookElement(this);
    updateBookForm.elements[0].value = book.title;
    updateBookForm.elements[1].value = book.author 
    updateBookForm.elements[2].value = book.pages;
    updateBookForm.elements[3].checked = book.isRead;;
    updateBookForm.dataset['index'] = this.dataset['index']     // save current index
  }
}

function isReadClickHandler(event) {
  const thisBook = Book.createBookFromBookElement(this.closest('.book'));
  const newIsRead = this.classList.toggle('done-read');
  dbToggleIsRead(User.getCurrUser(), thisBook, newIsRead);
}

function dbToggleIsRead(user, book, newIsRead) {

  const userRef = db.collection('users').doc(User.getUserId());

  return userRef.collection('books').doc(book.getBookId()).update({
    isRead: newIsRead
  }).catch(error => console.error("Error: update isRead failed", error));
}

// BookElement 
function addBookEnterHandler(event) {
  this.querySelector('.material-icons').classList.add('rotate-icon');
}

// BookElement 
function addBookLeaveHandler(event) {
  this.querySelector('.material-icons').classList.remove('rotate-icon');
}

// BookElement 
function addBookClickHandler(event) {
  addBookFormBg.classList.add('add-book-background-visible');
  resetAddBookForm();
}

// BookElement
function addBookFormBgClickHandler(event) {
  if (event.target === this) {
    addBookFormBg.classList.remove('add-book-background-visible');
  }
}

// BookElement 
function updateBookFormBgClickHandler(event) {
  if (event.target === this) {
    updateBookFormBg.classList.remove('update-book-background-visible');
  }
}

// App
function deleteBook(event) {
  const thisBookElement = this.parentElement.parentElement.parentElement;
  const book = Book.createBookFromBookElement(thisBookElement);
  const index = parseInt(thisBookElement.dataset['index']);

  thisBookElement.parentNode.removeChild(thisBookElement)       // delete this book element

  const books = document.querySelectorAll('.book');

  for (let i=index; i<books.length-1; i++) {      
    books[i].dataset['index']--;    // update indexes after this book
  }

  deleteBookFromDb(User.getCurrUser(), book, index);
}

// App
function deleteBookFromDb(user, book, index) {
  const userRef = db.collection('users').doc(User.getUserId());

  return userRef.collection('books').doc(book.getBookId()).delete()
    .then(() => {
      dbUpdateIndexesAfterDelete(user, index)
    })
    .catch(error => console.error("Error: cannot delete book", error));
}

// App
function dbUpdateIndexesAfterDelete(user, targetIndex) {
  const userRef = db.collection('users').doc(User.getUserId());

  return userRef.collection('books').where('index', '>=', targetIndex)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach(doc => {
        console.log(doc.data());
        const bookData = doc.data();
        const book = new Book(bookData.title, bookData.author, bookData.pages, bookData.isRead);
        // TODO delete after 
        console.log(book.getBookId());
        userRef.collection('books').doc(book.getBookId()).update({
          index: firebase.firestore.FieldValue.increment(-1)
        });
      });
    }).catch(error => console.error("Error: cannot update book", error));
}

// App
function resetAddBookForm() {
  addBookForm.elements[0].value = '';
  addBookForm.elements[1].value = '';
  addBookForm.elements[2].value = '';
}




