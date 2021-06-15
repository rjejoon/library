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

function updateLibrary() {

    const booksHTML = myLibrary.map((book, index) => getBookHTMLTemplate(book, index));

    libraryGrid.innerHTML = booksHTML.join('');
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
    console.log(isRead);
    btnContainer.innerHTML = `
        <span class="material-icons done-icon ${isRead ? "done-read" : ""}">done</span>
        <span class="material-icons">delete_outline</span>`;

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
    book.querySelector('.done-icon').addEventListener('click', doneClickHandler); 
}

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






