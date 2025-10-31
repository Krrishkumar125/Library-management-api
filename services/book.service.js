const Book = require('../models/Book');

class BookService {
  async getAllBooks(queryParams) {
    const { page = 1, limit = 10, title, author, category, publisher } = queryParams;

    const filter = {};
    if (title) filter.title = { $regex: title, $options: 'i' };
    if (author) filter.author = { $regex: author, $options: 'i' };
    if (category) filter.category = category;
    if (publisher) filter.publisher = { $regex: publisher, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const totalBooks = await Book.countDocuments(filter);

    const books = await Book.find(filter)
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    return {
      books,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalBooks / parseInt(limit)),
        totalBooks,
        limit: parseInt(limit)
      }
    };
  }

  async getBookById(bookId) {
    const book = await Book.findById(bookId);

    if (!book) {
      throw new Error('Book not found');
    }

    return book;
  }

  async createBook(bookData) {
    if (bookData.availableCopies && bookData.totalCopies) {
      if (bookData.availableCopies > bookData.totalCopies) {
        throw new Error('Available copies cannot be greater than total copies');
      }
    }
    const existingBook = await Book.findOne({ isbn: bookData.isbn });
    if (existingBook) {
      throw new Error('Book with this ISBN already exists');
    }

    const book = await Book.create(bookData);
    return book;
  }

  async updateBook(bookId, updateData) {
    if (updateData.availableCopies || updateData.totalCopies) {
      const existingBook = await Book.findById(bookId);

      if (!existingBook) {
        throw new Error('Book not found');
      }

      const newAvailableCopies = updateData.availableCopies ?? existingBook.availableCopies;
      const newTotalCopies = updateData.totalCopies ?? existingBook.totalCopies;

      if (newAvailableCopies > newTotalCopies) {
        throw new Error('Available copies cannot be greater than total copies');
      }
    }

    const book = await Book.findByIdAndUpdate(
      bookId,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!book) {
      throw new Error('Book not found');
    }

    return book;
  }

  async deleteBook(bookId) {
    const book = await Book.findByIdAndDelete(bookId);

    if (!book) {
      throw new Error('Book not found');
    }

    return book;
  }

  async searchBooks(searchTerm, queryParams) {
    const { page = 1, limit = 10 } = queryParams;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const books = await Book.find(
      { $text: { $search: searchTerm } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(parseInt(limit))
      .skip(skip);

    const totalBooks = await Book.countDocuments({ $text: { $search: searchTerm } });

    return {
      books,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalBooks / parseInt(limit)),
        totalBooks,
        limit: parseInt(limit)
      }
    };
  }

  async getBooksByCategory(category, queryParams) {
    const { page = 1, limit = 10 } = queryParams;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const books = await Book.find({ category })
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const totalBooks = await Book.countDocuments({ category });

    return {
      books,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalBooks / parseInt(limit)),
        totalBooks,
        limit: parseInt(limit)
      }
    };
  }

  async checkAvailability(bookId) {
    const book = await Book.findById(bookId);

    if (!book) {
      throw new Error('Book not found');
    }

    return {
      isAvailable: book.availableCopies > 0,
      availableCopies: book.availableCopies,
      totalCopies: book.totalCopies
    };
  }

  async uploadBookCover(bookId, filePath) {
    const book = await Book.findById(bookId);

    if (!book) {
      throw new Error('Book not found');
    }

    if (book.coverImage) {
      const fs = require('fs');
      const oldPath = book.coverImage;
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    book.coverImage = filePath;
    await book.save();

    return book;
  }
}

module.exports = new BookService();
