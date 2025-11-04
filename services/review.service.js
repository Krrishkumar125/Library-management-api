const Review = require('../models/Review');
const Book = require('../models/Book');

class ReviewService {
  async getBookReviews(bookId, queryParams) {
    const { page = 1, limit = 10, sortBy = 'createdAt' } = queryParams;
    
    const book = await Book.findById(bookId);
    if (!book) {
      throw new Error('Book not found');
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let sortOption = {};
    if (sortBy === 'rating') {
      sortOption = { rating: -1 };
    } else if (sortBy === 'helpful') {
      sortOption = { helpful: -1 };
    } else {
      sortOption = { createdAt: -1 };
    }
    
    const reviews = await Review.find({ book: bookId })
      .populate('user', 'name profilePicture')
      .limit(parseInt(limit))
      .skip(skip)
      .sort(sortOption);
    
    const totalReviews = await Review.countDocuments({ book: bookId });
    
    return {
      reviews,
      book: {
        id: book._id,
        title: book.title,
        averageRating: book.averageRating,
        reviewCount: book.reviewCount
      },
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalReviews / parseInt(limit)),
        totalReviews,
        limit: parseInt(limit)
      }
    };
  }

  async createReview(bookId, userId, reviewData) {
    const book = await Book.findById(bookId);
    if (!book) {
      throw new Error('Book not found');
    }
    
    const existingReview = await Review.findOne({
      book: bookId,
      user: userId
    });
    
    if (existingReview) {
      throw new Error('User has already reviewed this book');
    }
    
    const review = await Review.create({
      book: bookId,
      user: userId,
      ...reviewData
    });
    
    await review.populate('user', 'name profilePicture');
    
    return review;
  }

  async updateReview(bookId, reviewId, userId, updateData) {
    const review = await Review.findById(reviewId);
    
    if (!review) {
      throw new Error('Review not found');
    }
    
    if (review.book.toString() !== bookId) {
      throw new Error('Review does not belong to this book');
    }
    
    if (review.user.toString() !== userId) {
      throw new Error('You can only update your own reviews');
    }
    
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).populate('user', 'name profilePicture');
    
    return updatedReview;
  }

  async deleteReview(bookId, reviewId, userId) {
    const review = await Review.findById(reviewId);
    
    if (!review) {
      throw new Error('Review not found');
    }
    
    if (review.book.toString() !== bookId) {
      throw new Error('Review does not belong to this book');
    }
    
    if (review.user.toString() !== userId) {
      throw new Error('You can only delete your own reviews');
    }
    
    await Review.findByIdAndDelete(reviewId);
    
    return review;
  }

  async markHelpful(reviewId) {
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpful: 1 } },
      { new: true }
    ).populate('user', 'name profilePicture');
    
    if (!review) {
      throw new Error('Review not found');
    }
    
    return review;
  }

  async markUnhelpful(reviewId) {
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { unhelpful: 1 } },
      { new: true }
    ).populate('user', 'name profilePicture');
    
    if (!review) {
      throw new Error('Review not found');
    }
    
    return review;
  }

  async getHighestRatedBooks(queryParams) {
    const { page = 1, limit = 10 } = queryParams;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const books = await Book.find({ reviewCount: { $gt: 0 } })
      .select('title author averageRating reviewCount coverImage')
      .sort({ averageRating: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const totalBooks = await Book.countDocuments({ reviewCount: { $gt: 0 } });
    
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
}

module.exports = new ReviewService();
