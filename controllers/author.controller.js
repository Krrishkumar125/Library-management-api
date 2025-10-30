const authorService = require('../services/author.service');
const { StatusCodes } = require('http-status-codes');

exports.getAuthors = async (req, res) => {
  try {
    const result = await authorService.getAllAuthors(req.query);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      count: result.authors.length,
      pagination: result.pagination,
      data: result.authors,
      message: "All authors are fetched",
      error: null
    });
  } catch (error) {
    console.error('Error in getAuthors:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: 'Server Error while fetching authors',
      error: error.message
    });
  }
};

exports.getAuthorById = async (req, res) => {
  try {
    const author = await authorService.getAuthorById(req.params.id);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      data: author,
      message: "The required author is fetched",
      error: null
    });
  } catch (error) {
    console.error('Error in getAuthorById:', error);
    
    if (error.message === 'Author not found' || error.kind === 'ObjectId') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: null,
        message: 'Author not found',
        error: error.message
      });
    }
    
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: 'Server Error while fetching the author',
      error: error.message
    });
  }
};

exports.createAuthor = async (req, res) => {
  try {
    const author = await authorService.createAuthor(req.body);
    
    return res.status(StatusCodes.CREATED).json({
      success: true,
      data: author,
      message: 'Author created successfully',
      error: null
    });
  } catch (error) {
    console.error('Error in createAuthor:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        data: null,
        message: 'Validation Error',
        error: messages
      });
    }
    
    if (error.message === 'Author with this email already exists') {
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
      message: 'Server Error while creating the author',
      error: error.message
    });
  }
};

exports.updateAuthor = async (req, res) => {
  try {
    const author = await authorService.updateAuthor(req.params.id, req.body);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      data: author,
      message: 'Author updated successfully',
      error: null
    });
  } catch (error) {
    console.error('Error in updateAuthor:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        data: null,
        message: 'Validation Error',
        error: messages
      });
    }
    
    if (error.message === 'Author not found' || error.kind === 'ObjectId') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: null,
        message: 'Author not found',
        error: error.message
      });
    }
    
    if (error.message === 'Author with this email already exists') {
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
      message: 'Server Error while updating the author',
      error: error.message
    });
  }
};

exports.deleteAuthor = async (req, res) => {
  try {
    await authorService.deleteAuthor(req.params.id);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      data: {},
      message: 'Author deleted successfully',
      error: null
    });
  } catch (error) {
    console.error('Error in deleteAuthor:', error);
    
    if (error.message === 'Author not found' || error.kind === 'ObjectId') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: null,
        message: 'Author not found',
        error: error.message
      });
    }
    
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: 'Server Error while deleting the author',
      error: error.message
    });
  }
};

exports.searchAuthors = async (req, res) => {
  try {
    const result = await authorService.searchAuthors(req.params.query, req.query);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      count: result.authors.length,
      pagination: result.pagination,
      data: result.authors,
      message: "Authors search results fetched successfully",
      error: null
    });
  } catch (error) {
    console.error('Error in searchAuthors:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: 'Server Error while searching authors',
      error: error.message
    });
  }
};

exports.getAuthorsByGenre = async (req, res) => {
  try {
    const result = await authorService.getAuthorsByGenre(req.params.genre, req.query);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      count: result.authors.length,
      pagination: result.pagination,
      data: result.authors,
      message: "Authors by genre fetched successfully",
      error: null
    });
  } catch (error) {
    console.error('Error in getAuthorsByGenre:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: 'Server Error while fetching authors by genre',
      error: error.message
    });
  }
};
