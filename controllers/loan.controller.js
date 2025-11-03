const loanService = require('../services/loan.service');
const { StatusCodes } = require('http-status-codes');

exports.getLoans = async (req, res) => {
  try {
    const result = await loanService.getAllLoans(req.query);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      count: result.loans.length,
      pagination: result.pagination,
      data: result.loans,
      message: "All loans are fetched",
      error: null
    });
  } catch (error) {
    console.error('Error in getLoans:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: 'Server Error while fetching loans',
      error: error.message
    });
  }
};

exports.getLoanById = async (req, res) => {
  try {
    const loan = await loanService.getLoanById(req.params.id);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      data: loan,
      message: "The required loan is fetched",
      error: null
    });
  } catch (error) {
    console.error('Error in getLoanById:', error);
    
    if (error.message === 'Loan not found' || error.kind === 'ObjectId') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: null,
        message: 'Loan not found',
        error: error.message
      });
    }
    
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: 'Server Error while fetching the loan',
      error: error.message
    });
  }
};

exports.createLoan = async (req, res) => {
  try {
    const loan = await loanService.createLoan(req.body);
    
    return res.status(StatusCodes.CREATED).json({
      success: true,
      data: loan,
      message: 'Loan created successfully',
      error: null
    });
  } catch (error) {
    console.error('Error in createLoan:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        data: null,
        message: 'Validation Error',
        error: messages
      });
    }
    
    if (error.message === 'Book not found' || 
        error.message === 'User not found' ||
        error.message === 'Book is not available for loan' ||
        error.message === 'User membership is not active' ||
        error.message === 'User already has an active loan for this book') {
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
      message: 'Server Error while creating the loan',
      error: error.message
    });
  }
};

exports.updateLoan = async (req, res) => {
  try {
    const loan = await loanService.updateLoan(req.params.id, req.body);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      data: loan,
      message: 'Loan updated successfully',
      error: null
    });
  } catch (error) {
    console.error('Error in updateLoan:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        data: null,
        message: 'Validation Error',
        error: messages
      });
    }
    
    if (error.message === 'Loan not found' || error.kind === 'ObjectId') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: null,
        message: 'Loan not found',
        error: error.message
      });
    }
    
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: 'Server Error while updating the loan',
      error: error.message
    });
  }
};

exports.returnLoan = async (req, res) => {
  try {
    const loan = await loanService.returnLoan(req.params.id);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      data: loan,
      message: loan.fineAmount > 0 
        ? `Book returned successfully. Fine amount: ₹${loan.fineAmount}`
        : 'Book returned successfully',
      error: null
    });
  } catch (error) {
    console.error('Error in returnLoan:', error);
    
    if (error.message === 'Loan not found' || error.kind === 'ObjectId') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: null,
        message: 'Loan not found',
        error: error.message
      });
    }
    
    if (error.message === 'Book has already been returned') {
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
      message: 'Server Error while returning the loan',
      error: error.message
    });
  }
};

exports.deleteLoan = async (req, res) => {
  try {
    await loanService.deleteLoan(req.params.id);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      data: {},
      message: 'Loan deleted successfully',
      error: null
    });
  } catch (error) {
    console.error('Error in deleteLoan:', error);
    
    if (error.message === 'Loan not found' || error.kind === 'ObjectId') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: null,
        message: 'Loan not found',
        error: error.message
      });
    }
    
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: 'Server Error while deleting the loan',
      error: error.message
    });
  }
};

exports.getOverdueLoans = async (req, res) => {
  try {
    const result = await loanService.getOverdueLoans(req.query);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      count: result.loans.length,
      pagination: result.pagination,
      data: result.loans,
      message: "Overdue loans fetched successfully",
      error: null
    });
  } catch (error) {
    console.error('Error in getOverdueLoans:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: 'Server Error while fetching overdue loans',
      error: error.message
    });
  }
};

exports.getUserLoans = async (req, res) => {
  try {
    const result = await loanService.getUserLoans(req.params.userId, req.query);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      count: result.loans.length,
      pagination: result.pagination,
      data: result.loans,
      message: "User loans fetched successfully",
      error: null
    });
  } catch (error) {
    console.error('Error in getUserLoans:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: 'Server Error while fetching user loans',
      error: error.message
    });
  }
};
