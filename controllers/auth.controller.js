const authService = require('../services/auth.service');
const { StatusCodes } = require('http-status-codes');

exports.register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    
    return res.status(StatusCodes.CREATED).json({
      success: true,
      data: result,
      message: 'User registered successfully',
      error: null
    });
  } catch (error) {
    console.error('Error in register:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        data: null,
        message: 'Validation Error',
        error: messages
      });
    }
    
    if (error.message === 'User already exists with this email') {
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
      message: 'Server Error while registering user',
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      data: result,
      message: 'User logged in successfully',
      error: null
    });
  } catch (error) {
    console.error('Error in login:', error);
    
    if (error.message === 'Please provide email and password' || 
        error.message === 'Invalid credentials') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        data: null,
        message: error.message,
        error: error.message
      });
    }
    
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: 'Server Error while logging in',
      error: error.message
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await authService.getMe(req.user.id);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      data: user,
      message: 'User profile fetched successfully',
      error: null
    });
  } catch (error) {
    console.error('Error in getMe:', error);
    
    if (error.message === 'User not found') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: null,
        message: error.message,
        error: error.message
      });
    }
    
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: 'Server Error while fetching user profile',
      error: error.message
    });
  }
};
