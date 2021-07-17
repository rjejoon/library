export default class Book {

  constructor(title='', author='', pages='', isRead=false) {
    this.title = title;
    this.author = author;
    this.pages = parseInt(pages);
    this.isRead = isRead;
  }

  static createBookFromBookElement(bookElement) {

    const title = bookElement.querySelector('.title').textContent;
    const author = bookElement.querySelector('.author').textContent;
    const pages = bookElement.querySelector('.pages').textContent.split(' ')[0];
    const isRead = bookElement.querySelector('.done-icon').classList.contains('done-read');

    return new Book(title, author, pages, isRead);
  }

  getBookId() {
    return this.title + this.author;
  }

}

