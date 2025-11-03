const Loan = require('../models/Loan');
const Book = require('../models/Book');
const User = require('../models/User');

class LoanService {
  async getAllLoans(queryParams) {
    const { page = 1, limit = 10, status, userId, bookId } = queryParams;
    
    const filter = {};
    if (status) filter.status = status;
    if (userId) filter.user = userId;
    if (bookId) filter.book = bookId;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const totalLoans = await Loan.countDocuments(filter);
    
    const loans = await Loan.find(filter)
      .populate('user', 'name email phone membershipStatus')
      .populate('book', 'title author isbn availableCopies')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });
    
    return {
      loans,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalLoans / parseInt(limit)),
        totalLoans,
        limit: parseInt(limit)
      }
    };
  }

  async getLoanById(loanId) {
    const loan = await Loan.findById(loanId)
      .populate('user', 'name email phone membershipStatus')
      .populate('book', 'title author isbn availableCopies');
    
    if (!loan) {
      throw new Error('Loan not found');
    }
    
    return loan;
  }

  async createLoan(loanData) {
    const { user, book, dueDate, notes } = loanData;
    
    const bookRecord = await Book.findById(book);
    if (!bookRecord) {
      throw new Error('Book not found');
    }
    
    if (bookRecord.availableCopies <= 0) {
      throw new Error('Book is not available for loan');
    }
    
    const userRecord = await User.findById(user);
    if (!userRecord) {
      throw new Error('User not found');
    }
    
    if (userRecord.membershipStatus !== 'active') {
      throw new Error('User membership is not active');
    }
    
    const existingActiveLoan = await Loan.findOne({
      user,
      book,
      status: 'active'
    });
    
    if (existingActiveLoan) {
      throw new Error('User already has an active loan for this book');
    }
    
    bookRecord.availableCopies -= 1;
    await bookRecord.save();
    
    userRecord.booksLoaned += 1;
    await userRecord.save();
    
    const loan = await Loan.create({
      user,
      book,
      dueDate,
      notes
    });
    
    await loan.populate('user', 'name email phone');
    await loan.populate('book', 'title author isbn');
    
    return loan;
  }

  async updateLoan(loanId, updateData) {
    const loan = await Loan.findByIdAndUpdate(
      loanId,
      updateData,
      {
        new: true,
        runValidators: true
      }
    )
      .populate('user', 'name email phone')
      .populate('book', 'title author isbn');
    
    if (!loan) {
      throw new Error('Loan not found');
    }
    
    return loan;
  }

  async returnLoan(loanId) {
    const loan = await Loan.findById(loanId);
    
    if (!loan) {
      throw new Error('Loan not found');
    }
    
    if (loan.status === 'returned') {
      throw new Error('Book has already been returned');
    }
    
    loan.returnDate = new Date();
    loan.status = 'returned';
    
    if (loan.returnDate > loan.dueDate) {
      const daysLate = Math.ceil((loan.returnDate - loan.dueDate) / (1000 * 60 * 60 * 24));
      loan.fineAmount = daysLate * 10;
      
      const user = await User.findById(loan.user);
      if (user) {
        user.fineAmount += loan.fineAmount;
        await user.save();
      }
    }
    
    await loan.save();
    
    const book = await Book.findById(loan.book);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }
    
    await loan.populate('user', 'name email phone fineAmount');
    await loan.populate('book', 'title author isbn availableCopies');
    
    return loan;
  }

  async deleteLoan(loanId) {
    const loan = await Loan.findByIdAndDelete(loanId);
    
    if (!loan) {
      throw new Error('Loan not found');
    }
    
    return loan;
  }

  async getOverdueLoans(queryParams) {
    const { page = 1, limit = 10 } = queryParams;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const currentDate = new Date();
    
    const loans = await Loan.find({
      status: 'active',
      dueDate: { $lt: currentDate }
    })
      .populate('user', 'name email phone')
      .populate('book', 'title author isbn')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ dueDate: 1 });
    
    const totalLoans = await Loan.countDocuments({
      status: 'active',
      dueDate: { $lt: currentDate }
    });
    
    return {
      loans,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalLoans / parseInt(limit)),
        totalLoans,
        limit: parseInt(limit)
      }
    };
  }

  async getUserLoans(userId, queryParams) {
    const { page = 1, limit = 10, status } = queryParams;
    
    const filter = { user: userId };
    if (status) filter.status = status;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const loans = await Loan.find(filter)
      .populate('book', 'title author isbn coverImage')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });
    
    const totalLoans = await Loan.countDocuments(filter);
    
    return {
      loans,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalLoans / parseInt(limit)),
        totalLoans,
        limit: parseInt(limit)
      }
    };
  }
}

module.exports = new LoanService();
