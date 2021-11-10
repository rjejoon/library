export function Book(title, author, pages, isRead) {
  // constructor
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
}

export const bookConverter = {
  toFirestore: (book) => {
    return {
      title: book.title,
      author: book.author,
      pages: book.pages,
      isRead: book.isRead,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Book(data.title, data.author, data.pages, data.isRead);
  }
}