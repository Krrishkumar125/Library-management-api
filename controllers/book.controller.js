const bookService = require('../services/book.service');
const { StatusCodes } = require('http-status-codes');

exports.getBooks = async (req, res) => {
  try {
    const result = await bookService.getAllBooks(req.query);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      count: result.books.length,
      pagination: result.pagination,
      data: result.books,
      message: "All the books are fetched",
      error: null
    });
  } catch (error) {
    console.error('Error in getBooks:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: 'Server Error while fetching the books',
      error: error.message
    });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      data: book,
      message: "The required book is fetched",
      error: null
    });
  } catch (error) {
    console.error('Error in getBookById:', error);
    
    if (error.message === 'Book not found' || error.kind === 'ObjectId') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: null,
        message: 'Book not found',
        error: error.message
      });
    }
    
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: 'Server Error while fetching the book',
      error: error.message
    });
  }
};

exports.createBook = async (req, res) => {
  try {
    const book = await bookService.createBook(req.body);
    
    return res.status(StatusCodes.CREATED).json({
      success: true,
      data: book,
      message: 'Book created successfully',
      error: null
    });
  } catch (error) {
    console.error('Error in createBook:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        data: null,
        message: 'Validation Error',
        error: messages
      });
    }
    
    if (error.message === 'Book with this ISBN already exists' ||
        error.message === 'Available copies cannot be greater than total copies') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        data: null,
        message: error.message,
        error: error.message
      });
    }
    
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: 'Server Error while creating the book',
      error: error.message
    });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await bookService.updateBook(req.params.id, req.body);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      data: book,
      message: 'Book updated successfully',
      error: null
    });
  } catch (error) {
    console.error('Error in updateBook:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        data: null,
        message: 'Validation Error',
        error: messages
      });
    }
    
    if (error.message === 'Book not found' || error.kind === 'ObjectId') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: null,
        message: 'Book not found',
        error: error.message
      });
    }
    
    if (error.message === 'Available copies cannot be greater than total copies') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        data: null,
        message: error.message,
        error: error.message
      });
    }
    
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: 'Server Error while updating the book',
      error: error.message
    });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    await bookService.deleteBook(req.params.id);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      data: {},
      message: 'Book deleted successfully',
      error: null
    });
  } catch (error) {
    console.error('Error in deleteBook:', error);
    
    if (error.message === 'Book not found' || error.kind === 'ObjectId') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: null,
        message: 'Book not found',
        error: error.message
      });
    }
    
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: 'Server Error while deleting the book',
      error: error.message
    });
  }
};

exports.searchBooks = async (req, res) => {
  try {
    const result = await bookService.searchBooks(req.params.query, req.query);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      count: result.books.length,
      pagination: result.pagination,
      data: result.books,
      message: "Books search results fetched successfully",
      error: null
    });
  } catch (error) {
    console.error('Error in searchBooks:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: 'Server Error while searching books',
      error: error.message
    });
  }
};

exports.getBooksByCategory = async (req, res) => {
  try {
    const result = await bookService.getBooksByCategory(req.params.category, req.query);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      count: result.books.length,
      pagination: result.pagination,
      data: result.books,
      message: "Books by category fetched successfully",
      error: null
    });
  } catch (error) {
    console.error('Error in getBooksByCategory:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: 'Server Error while fetching books by category',
      error: error.message
    });
  }
};

exports.checkAvailability = async (req, res) => {
  try {
    const availability = await bookService.checkAvailability(req.params.id);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      data: availability,
      message: "Book availability checked successfully",
      error: null
    });
  } catch (error) {
    console.error('Error in checkAvailability:', error);
    
    if (error.message === 'Book not found' || error.kind === 'ObjectId') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: null,
        message: 'Book not found',
        error: error.message
      });
    }
    
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: 'Server Error while checking book availability',
      error: error.message
    });
  }
};
