import libraryGrid from "../components/library/library-grid.js";


const library = (() => {
  const libList = [];

  function getBookIdAt(index) {
    return libList[index][0];
  }

  function getBookAt(index) {
    return libList[index][1];
  }

  function getLength() {
    return libList.length;
  }

  /**
   * Pushes a pair of an id and a book object into the library list.
   * Updates DOM accordingly.
   * 
   * @param {string} id - Firestore doc id for the book
   * @param {Book} book - a Book object
   */
  function push(id, book) {
    const index = getLength();
    libList.push([id, book]);
    libraryGrid.pushBookElement(book, index);
  };

  /**
   * Replaces the old book in index with newBook.
   * Updates DOM accordingly.
   * 
   * @param {number} index - target position of the list
   * @param {Book} newBook - an updated Book object
   */
  function replaceBookAt(index, newBook) {
    libList[index][1] = newBook;
    libraryGrid.updateBookElementAt(index, newBook);
  };

  /**
   * Deletes a pair of an id and a book object at index.
   * Updates DOM accordingly.
   * 
   * @param {number} index 
   */
  function deleteAt(index) {
    libList.splice(index, 1);
    libraryGrid.deleteBookElementAt(index);
  };

  /**
   * Clear all pairs in the library list.
   */
  function clear() {
    libList.length = 0;
    libraryGrid.clearGrid();
  }
  
  return {
    getBookIdAt,
    getBookAt,
    getLength,
    push,
    replaceBookAt,
    deleteAt,
    clear,
  };
})();


export default library;