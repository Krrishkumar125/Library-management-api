const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getBookReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
  markUnhelpful,
  getHighestRatedBooks
} = require('../controllers/review.controller');
const { protect } = require('../middleware/auth');

router.get('/', getBookReviews);
router.post('/', protect, createReview);
router.put('/:reviewId', protect, updateReview);
router.delete('/:reviewId', protect, deleteReview);
router.patch('/:reviewId/helpful', protect, markHelpful);
router.patch('/:reviewId/unhelpful', protect, markUnhelpful);

router.get('/highest-rated', getHighestRatedBooks);

module.exports = router;
