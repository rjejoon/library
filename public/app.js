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

function signIn() {
    let provider = new firebase.auth.GoogleAuthProvider();

}

const libraryGrid = document.querySelector('.library-grid');
const addBookEle = document.querySelector('.add-book');
const addBookFormSubmitBtn = document.querySelector('.add-book-submit-btn');
const addBookForm = document.querySelector('.add-book-form');
const addBookFormBg = document.querySelector('.add-book-background');

let myLibrary = [];

window.addEventListener('DOMContentLoaded', e => {

    addBookEle.addEventListener('mouseenter', addBookEnterHandler);
    addBookEle.addEventListener('mouseleave', addBookLeaveHandler);
    addBookEle.addEventListener('click', addBookClickHandler);

    addBookFormSubmitBtn.addEventListener('mouseenter', e => e.target.classList.add('btn-mouseenter'));
    addBookFormSubmitBtn.addEventListener('mouseleave', e => e.target.classList.remove('btn-mouseenter'));

    addBookForm.addEventListener('submit', addBookToLibrary);
    addBookFormBg.addEventListener('click', addBookFormBgClickHandler);
});


function Book(title='', author='', pages='', isRead=false) {
    // constructor
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
}

function addBookToLibrary(e) {
    e.preventDefault();
    const title = this.elements[0].value;
    const author = this.elements[1].value;
    const pages = this.elements[2].value;
    const isRead = this.elements[3].checked;

    const book = new Book(title, author, pages, isRead);
    myLibrary.push(book);

    const bookEle = createBookElement(book, myLibrary.length-1);
    libraryGrid.insertBefore(bookEle, addBookEle);

    addBookFormBg.classList.remove('add-book-background-visible');  // hide form
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
    addBookElementEvents(book);

    return book;
}

function addBookElementEvents(book) {
    book.addEventListener('mouseenter', bookEnterHandler);
    book.addEventListener('mouseleave', bookLeaveHandler);
    book.querySelector('.done-icon').addEventListener('click', isReadClickHandler); 
    book.querySelector('.del-book-icon').addEventListener('click', deleteBook);
}

function bookEnterHandler(e) {
    this.querySelector('.button-container').classList.add('visible');
}

function bookLeaveHandler(e) {
    this.querySelector('.button-container').classList.remove('visible');
}

function isReadClickHandler(e) {
    this.classList.toggle('done-read');

    const targetBook = this.parentElement.parentElement.parentElement;
    myLibrary[targetBook.dataset['index']].isRead = !myLibrary[targetBook.dataset['index']].isRead;
}

function addBookEnterHandler(e) {
    this.querySelector('.material-icons').classList.add('rotate-icon');
}

function addBookLeaveHandler(e) {
    this.querySelector('.material-icons').classList.remove('rotate-icon');
}

function addBookClickHandler(e) {
    addBookFormBg.classList.add('add-book-background-visible');
}

function addBookFormBgClickHandler(e) {
    if (e.target === this) {
        addBookFormBg.classList.remove('add-book-background-visible');
    }
}

function deleteBook(e) {
    const thisBook = this.parentElement.parentElement.parentElement;
    const index = thisBook.dataset['index'];

    myLibrary.splice(index, 1);         // delete this book obj 
    thisBook.parentNode.removeChild(thisBook)       // delete this book element

    const books = document.querySelectorAll('.book');

    for (let i=index; i<books.length-1; i++) {      
        books[i].dataset['index']--;    // update indexes after this book
    }
}






