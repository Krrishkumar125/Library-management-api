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
  checkAvailability,
  uploadBookCover
} = require('../controllers/book.controller');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getBooks);
router.get('/search/:query', searchBooks);
router.get('/category/:category', getBooksByCategory);
router.get('/:id', getBookById);
router.get('/:id/availability', checkAvailability);

router.post('/',protect, createBook);
router.put('/:id',protect, updateBook);
router.delete('/:id',protect, deleteBook);
router.patch('/:id/upload-cover', protect, upload.single('coverImage'), uploadBookCover);

module.exports = router;
