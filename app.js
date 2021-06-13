const books = document.querySelectorAll('.book');
const addBookEle = document.querySelector('#add-book');
const addBookForm = document.querySelector('#add-book-form');

books.forEach(book => {
    if (book.id != 'add-book') {
        book.addEventListener('mouseenter', bookEnterHandler)
        book.addEventListener('mouseleave', bookLeaveHandler)
        book.querySelector('.done-icon').addEventListener('click', doneClickHandler); 
    }
});

addBookEle.addEventListener('mouseenter', addBookEnterHandler);
addBookEle.addEventListener('mouseleave', addBookLeaveHandler);

addBookForm.addEventListener('submit', getBookInfo);

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

function getBookInfo(e) {
    e.preventDefault();
    const title = this.elements[0].value;
    const author = this.elements[1].value;
    const pages = this.elements[2].value;
    const isRead = this.elements[3].checked;

    console.log(title, author, pages, isRead);
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




