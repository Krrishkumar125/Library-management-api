const express = require('express');
const router = express.Router();
const {
  getLoans,
  getLoanById,
  createLoan,
  updateLoan,
  returnLoan,
  deleteLoan,
  getOverdueLoans,
  getUserLoans
} = require('../controllers/loan.controller');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getLoans);
router.get('/overdue', getOverdueLoans);
router.get('/user/:userId', getUserLoans);
router.get('/:id', getLoanById);
router.post('/', createLoan);
router.put('/:id', updateLoan);
router.patch('/:id/return', returnLoan);
router.delete('/:id', deleteLoan);

module.exports = router;
