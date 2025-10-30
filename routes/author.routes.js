const express = require('express');
const router = express.Router();
const {
  getAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  searchAuthors,
  getAuthorsByGenre
} = require('../controllers/author.controller');
const { protect } = require('../middleware/auth');

router.get('/', getAuthors);
router.get('/search/:query', searchAuthors);
router.get('/genre/:genre', getAuthorsByGenre);
router.get('/:id', getAuthorById);

router.post('/', protect, createAuthor);
router.put('/:id', protect, updateAuthor);
router.delete('/:id', protect, deleteAuthor);

module.exports = router;
