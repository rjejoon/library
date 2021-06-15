const libraryGrid = document.querySelector('.library-grid');
const addBookEle = document.querySelector('.add-book');
const addBookFormSubmitBtn = document.querySelector('.add-book-submit-btn');
const addBookForm = document.querySelector('.add-book-form');
const addBookFormBg = document.querySelector('.add-book-background');

const books = document.querySelectorAll('.book');

books.forEach(book => {
    if (!book.classList.contains('add-book')) {
        book.addEventListener('mouseenter', bookEnterHandler);
        book.addEventListener('mouseleave', bookLeaveHandler);
        book.querySelector('.done-icon').addEventListener('click', doneClickHandler); 
    }
});

window.addEventListener('DOMContentLoaded', e => {

    addBookEle.addEventListener('mouseenter', addBookEnterHandler);
    addBookEle.addEventListener('mouseleave', addBookLeaveHandler);
    addBookEle.addEventListener('click', addBookClickHandler);

    addBookFormSubmitBtn.addEventListener('mouseenter', e => e.target.classList.add('btn-mouseenter'));
    addBookFormSubmitBtn.addEventListener('mouseleave', e => e.target.classList.remove('btn-mouseenter'));

    addBookForm.addEventListener('submit', addBookToLibrary);
    addBookFormBg.addEventListener('click', addBookFormBgClickHandler);
});


function bookEnterHandler(e) {
    this.querySelector('.button-container').classList.add('visible');
}

function bookLeaveHandler(e) {
    this.querySelector('.button-container').classList.remove('visible');
}

function doneClickHandler(e) {
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
}

function addBookFormBgClickHandler(e) {
    if (e.target === this) {
        addBookFormBg.classList.remove('add-book-background-visible');
    }
}


let myLibrary = [];

function Book(title='', author='', pages='', isRead=false) {
    // constructor
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = isRead;
}

function addBookToLibrary(e) {
    e.preventDefault();
    const title = this.elements[0].value;
    const author = this.elements[1].value;
    const pages = this.elements[2].value;
    const isRead = this.elements[3].checked;

    const book = new Book(title, author, pages, isRead);
    myLibrary.push(book);
    //updateLibrary();
}

function updateLibrary() {

    const booksHTML = myLibrary.map((book, index) => getBookHTMLTemplate(book, index));

    libraryGrid.innerHTML = booksHTML.join('');
}


function getBookHTMLTemplate({ title, author, pages, isRead }, index) {
    return `
      <div class="book" data-index="${index}">
        <div class="book-info-container">
          <span class="title">${title}</span>
          <span class="author">${author}</span>
          <span class="pages">${pages} pages</span>
          <div class="button-container">
            <span class="material-icons done-icon">done</span>
            <span class="material-icons">delete_outline</span>
          </div>
        </div>
      </div>
    `;
}




