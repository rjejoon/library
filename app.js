const books = document.querySelectorAll('.book');
const addBookEle = document.querySelector('#add-book');

books.forEach(book => {
    book.addEventListener('mouseenter', bookEnterHandler)
    book.addEventListener('mouseleave', bookLeaveHandler)
    book.querySelector('.done-icon').addEventListener('click', doneClickHandler); 
});

addBookEle.addEventListener('mouseenter', addBookEnterHandler);
addBookEle.addEventListener('mouseleave', addBookLeaveHandler);

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



let myLibrary = [];

function Book(title='', author='', pages='', isRead=false) {
    // constructor
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = isRead;
}

function addBookToLibrary() {

}




