// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC1jdymiNr6d_Y-WGj2jAHioWrUYrUTGcs",
    authDomain: "library-eb55f.firebaseapp.com",
    projectId: "library-eb55f",
    storageBucket: "library-eb55f.appspot.com",
    messagingSenderId: "404425878326",
    appId: "1:404425878326:web:c1e602083c874dd0932197",
    measurementId: "G-NBXHT6KEH0"
};

firebase.initializeApp(firebaseConfig);
initFirebaseAuth();

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

    //updateBookForm.addEventListener('submit', updateBook);
    updateBookFormBg.addEventListener('click', updateBookFormBgClickHandler);

    signInBtn.addEventListener('click', signIn);
    signOutBtn.addEventListener('click', signOut);
});



function initFirebaseAuth() {
    firebase.auth().onAuthStateChanged(authStateObserver);
}

function signIn() {
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
}

function signOut() {
    firebase.auth().signOut();
}

function getProfilePicUrl() {
    return firebase.auth().currentUser.photoURL ?? '/images/profile_placeholder.jpeg';
}

function getUserName() {
    return firebase.auth().currentUser.displayName;
}

function getUserId() {
    return firebase.auth().currentUser.uid;
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

function saveBook(user, book, index) {
    saveUser(user);

    const uid = getUserId();
    const bookId = getBookId(book);   
    return db.collection('users').doc(uid).collection('books').doc(bookId).set({ 
            ...book, 
            index,
            uid: getUserId(),
        }).catch(error => console.error('Error writing new book to database', error));
}

function getBookId(book) {
    return book.title + book.author;
}

function saveUser(user) {
    return firebase.firestore().collection('users').doc(getUserId()).set({
            username: user.displayName,
            email: user.email,
            profileUrl: user.photoURL
    }).catch(error => console.error("Unable to save user", error));
}

function clearLibrary() {
    const books = libraryGrid.querySelectorAll('.book');

    // remove all books except for add book
    for (let i=0; i<books.length-1; i++) {
        libraryGrid.removeChild(libraryGrid.firstElementChild);
    }
}

function Book(title='', author='', pages='', isRead=false) {
    // constructor
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
}

function createBookFromBookElement(bookElement) {

    const title = bookElement.querySelector('.title').textContent;
    const author = bookElement.querySelector('.author').textContent;
    const pages = bookElement.querySelector('.pages').textContent.split(' ')[0];
    const isRead = bookElement.querySelector('.done-icon').classList.contains('done-read');

    return new Book(title, author, pages, isRead);
}

function addBookToLibraryGrid(event) {
    event.preventDefault();
    const title = this.elements[0].value;
    const author = this.elements[1].value;
    const pages = this.elements[2].value;
    const isRead = this.elements[3].checked;
    const index = getFirstFreeBookIndex();

    const book = new Book(title, author, pages, isRead);

    const bookEle = createBookElement(book, index);
    libraryGrid.insertBefore(bookEle, addBookEle);
    saveBook(firebase.auth().currentUser, book, index);

    addBookFormBg.classList.remove('add-book-background-visible');  // hide add book form
}

function getFirstFreeBookIndex() {
    return libraryGrid.querySelectorAll('.book').length - 1;     // exclude add book element
}

function createBookElement({ title, author, pages, isRead }, index) {
    const book = document.createElement('div');
    book.classList.add('book')
    book.dataset['index'] = index;

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
    
    book.appendChild(bookInfoContainer);
    console.log(book);
    addBookElementEvents(book);

    return book;
}

function addBookElementEvents(book) {
    book.addEventListener('mouseenter', bookEnterHandler);
    book.addEventListener('mouseleave', bookLeaveHandler);
    book.addEventListener('click', toggleUpdateForm);
    book.querySelector('.done-icon').addEventListener('click', isReadClickHandler); 
    book.querySelector('.del-book-icon').addEventListener('click', deleteBook);
}

function bookEnterHandler(e) {
    this.querySelector('.button-container').classList.add('visible');
}

function bookLeaveHandler(e) {
    this.querySelector('.button-container').classList.remove('visible');
}

function toggleUpdateForm(event) {

    if (!event.target.classList.contains('material-icons')) {       // toggle form when clicked anywhere other than buttons
        updateBookFormBg.classList.add('update-book-background-visible');

        const book = createBookFromBookElement(this);
        updateBookForm.elements[0].value = book.title;
        updateBookForm.elements[1].value = book.author 
        updateBookForm.elements[2].value = book.pages;
        updateBookForm.elements[3].checked = book.isRead;;
    }
}

function isReadClickHandler(e) {
    this.classList.toggle('done-read');
}

function addBookEnterHandler(e) {
    this.querySelector('.material-icons').classList.add('rotate-icon');
}

function addBookLeaveHandler(e) {
    this.querySelector('.material-icons').classList.remove('rotate-icon');
}

function addBookClickHandler(e) {
    addBookFormBg.classList.add('add-book-background-visible');
    resetAddBookForm();
}

function addBookFormBgClickHandler(e) {
    if (e.target === this) {
        addBookFormBg.classList.remove('add-book-background-visible');
    }
}

function updateBookFormBgClickHandler(e) {
    if (e.target === this) {
        updateBookFormBg.classList.remove('update-book-background-visible');
    }
}

function deleteBook(event) {
    const thisBookElement = this.parentElement.parentElement.parentElement;
    const book = createBookFromBookElement(thisBookElement);
    const index = parseInt(thisBookElement.dataset['index']);

    thisBookElement.parentNode.removeChild(thisBookElement)       // delete this book element

    const books = document.querySelectorAll('.book');

    for (let i=index; i<books.length-1; i++) {      
        books[i].dataset['index']--;    // update indexes after this book
    }

    deleteBookFromDb(book, index);
}

function deleteBookFromDb(book, index) {
    const userRef = db.collection('users').doc(getUserId());

    return userRef.collection('books').doc(getBookId(book)).delete()
        .then(() => {
            dbUpdateIndexAfter(index)
        })
        .catch(error => console.error("Error: cannot delete book", error));
}

function dbUpdateIndexAfter(targetIndex) {
    const userRef = db.collection('users').doc(getUserId());

    return userRef.collection('books').where('index', '>=', targetIndex)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach(doc => {
                console.log(doc.data());
                const bookData = doc.data();
                const book = new Book(bookData.title, bookData.author, bookData.pages, bookData.isRead);
                console.log(getBookId(book));
                userRef.collection('books').doc(getBookId(book)).update({
                    index: firebase.firestore.FieldValue.increment(-1)
                });
            });
        }).catch(error => console.error("Error: cannot update book", error));
}

function resetAddBookForm() {
    addBookForm.elements[0].value = '';
    addBookForm.elements[1].value = '';
    addBookForm.elements[2].value = '';
}




