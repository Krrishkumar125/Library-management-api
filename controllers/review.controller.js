const reviewService = require('../services/review.service');
const { StatusCodes } = require('http-status-codes');

exports.getBookReviews = async (req, res) => {
  try {
    const result = await reviewService.getBookReviews(req.params.bookId, req.query);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      count: result.reviews.length,
      pagination: result.pagination,
      book: result.book,
      data: result.reviews,
      message: "Book reviews fetched successfully",
      error: null
    });
  } catch (error) {
    console.error('Error in getBookReviews:', error);
    
    if (error.message === 'Book not found') {
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
      message: 'Server Error while fetching book reviews',
      error: error.message
    });
  }
};

exports.createReview = async (req, res) => {
  try {
    const review = await reviewService.createReview(
      req.params.bookId,
      req.user.id,
      req.body
    );
    
    return res.status(StatusCodes.CREATED).json({
      success: true,
      data: review,
      message: 'Review created successfully',
      error: null
    });
  } catch (error) {
    console.error('Error in createReview:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        data: null,
        message: 'Validation Error',
        error: messages
      });
    }
    
    if (error.message === 'Book not found') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: null,
        message: 'Book not found',
        error: error.message
      });
    }
    
    if (error.message === 'User has already reviewed this book') {
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
      message: 'Server Error while creating review',
      error: error.message
    });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const review = await reviewService.updateReview(
      req.params.bookId,
      req.params.reviewId,
      req.user.id,
      req.body
    );
    
    return res.status(StatusCodes.OK).json({
      success: true,
      data: review,
      message: 'Review updated successfully',
      error: null
    });
  } catch (error) {
    console.error('Error in updateReview:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        data: null,
        message: 'Validation Error',
        error: messages
      });
    }
    
    if (error.message === 'Review not found' || error.kind === 'ObjectId') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: null,
        message: 'Review not found',
        error: error.message
      });
    }
    
    if (error.message === 'Review does not belong to this book' ||
        error.message === 'You can only update your own reviews') {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        data: null,
        message: error.message,
        error: error.message
      });
    }
    
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: 'Server Error while updating review',
      error: error.message
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    await reviewService.deleteReview(
      req.params.bookId,
      req.params.reviewId,
      req.user.id
    );
    
    return res.status(StatusCodes.OK).json({
      success: true,
      data: {},
      message: 'Review deleted successfully',
      error: null
    });
  } catch (error) {
    console.error('Error in deleteReview:', error);
    
    if (error.message === 'Review not found' || error.kind === 'ObjectId') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: null,
        message: 'Review not found',
        error: error.message
      });
    }
    
    if (error.message === 'Review does not belong to this book' ||
        error.message === 'You can only delete your own reviews') {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        data: null,
        message: error.message,
        error: error.message
      });
    }
    
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: 'Server Error while deleting review',
      error: error.message
    });
  }
};

exports.markHelpful = async (req, res) => {
  try {
    const review = await reviewService.markHelpful(req.params.reviewId);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      data: review,
      message: 'Review marked as helpful',
      error: null
    });
  } catch (error) {
    console.error('Error in markHelpful:', error);
    
    if (error.message === 'Review not found' || error.kind === 'ObjectId') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: null,
        message: 'Review not found',
        error: error.message
      });
    }
    
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: 'Server Error while marking review as helpful',
      error: error.message
    });
  }
};

exports.markUnhelpful = async (req, res) => {
  try {
    const review = await reviewService.markUnhelpful(req.params.reviewId);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      data: review,
      message: 'Review marked as unhelpful',
      error: null
    });
  } catch (error) {
    console.error('Error in markUnhelpful:', error);
    
    if (error.message === 'Review not found' || error.kind === 'ObjectId') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: null,
        message: 'Review not found',
        error: error.message
      });
    }
    
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: 'Server Error while marking review as unhelpful',
      error: error.message
    });
  }
};

exports.getHighestRatedBooks = async (req, res) => {
  try {
    const result = await reviewService.getHighestRatedBooks(req.query);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      count: result.books.length,
      pagination: result.pagination,
      data: result.books,
      message: "Highest rated books fetched successfully",
      error: null
    });
  } catch (error) {
    console.error('Error in getHighestRatedBooks:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: 'Server Error while fetching highest rated books',
      error: error.message
    });
  }
};
