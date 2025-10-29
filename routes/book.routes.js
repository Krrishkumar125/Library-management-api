const express = require('express');
const router = express.Router();
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  searchBooks,
  getBooksByCategory,
  checkAvailability
} = require('../controllers/book.controller');
const { protect } = require('../middleware/auth');

router.get('/', getBooks);
router.get('/search/:query', searchBooks);
router.get('/category/:category', getBooksByCategory);
router.get('/:id', getBookById);
router.get('/:id/availability', checkAvailability);

router.post('/',protect, createBook);
router.put('/:id',protect, updateBook);
router.delete('/:id',protect, deleteBook);

module.exports = router;
