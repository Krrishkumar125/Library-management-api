const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      data: null,
      message: 'Not authorized to access this route. Please provide a valid token',
      error: 'No token provided'
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error in protect middleware:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        data: null,
        message: 'Token has expired. Please login again',
        error: error.message
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        data: null,
        message: 'Invalid token. Please provide a valid token',
        error: error.message
      });
    }
    
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      data: null,
      message: 'Not authorized to access this route',
      error: error.message
    });
  }
};