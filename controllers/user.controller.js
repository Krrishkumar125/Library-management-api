const userService = require('../services/user.service');
const { StatusCodes } = require('http-status-codes');

exports.getUsers = async (req, res) => {
  try {
    const result = await userService.getAllUsers(req.query);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      count: result.users.length,
      pagination: result.pagination,
      data: result.users,
      message: "All users are fetched",
      error: null
    });
  } catch (error) {
    console.error('Error in getUsers:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: 'Server Error while fetching users',
      error: error.message
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      data: user,
      message: "The required user is fetched",
      error: null
    });
  } catch (error) {
    console.error('Error in getUserById:', error);
    
    if (error.message === 'User not found' || error.kind === 'ObjectId') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: null,
        message: 'User not found',
        error: error.message
      });
    }
    
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: 'Server Error while fetching the user',
      error: error.message
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      data: user,
      message: 'User updated successfully',
      error: null
    });
  } catch (error) {
    console.error('Error in updateUser:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        data: null,
        message: 'Validation Error',
        error: messages
      });
    }
    
    if (error.message === 'User not found' || error.kind === 'ObjectId') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: null,
        message: 'User not found',
        error: error.message
      });
    }
    
    if (error.message === 'User with this email already exists') {
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
      message: 'Server Error while updating the user',
      error: error.message
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      data: {},
      message: 'User deleted successfully',
      error: null
    });
  } catch (error) {
    console.error('Error in deleteUser:', error);
    
    if (error.message === 'User not found' || error.kind === 'ObjectId') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: null,
        message: 'User not found',
        error: error.message
      });
    }
    
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: 'Server Error while deleting the user',
      error: error.message
    });
  }
};

exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        data: null,
        message: 'Please upload an image file',
        error: 'No file uploaded'
      });
    }
    
    const user = await userService.uploadProfilePicture(req.user.id, req.file.path);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      data: {
        user: user,
        file: {
          filename: req.file.filename,
          path: req.file.path,
          size: req.file.size,
          mimetype: req.file.mimetype
        }
      },
      message: 'Profile picture uploaded successfully',
      error: null
    });
  } catch (error) {
    console.error('Error in uploadProfilePicture:', error);
    
    if (req.file && req.file.path) {
      const fs = require('fs');
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }
    
    if (error.message === 'User not found' || error.kind === 'ObjectId') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: null,
        message: 'User not found',
        error: error.message
      });
    }
    
    if (error.message && error.message.includes('Only image files')) {
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
      message: 'Server Error while uploading profile picture',
      error: error.message
    });
  }
};

exports.getUsersByRole = async (req, res) => {
  try {
    const result = await userService.getUsersByRole(req.params.role, req.query);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      count: result.users.length,
      pagination: result.pagination,
      data: result.users,
      message: "Users by role fetched successfully",
      error: null
    });
  } catch (error) {
    console.error('Error in getUsersByRole:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: 'Server Error while fetching users by role',
      error: error.message
    });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        data: null,
        message: 'Status is required',
        error: 'Status field missing in request body'
      });
    }
    
    const user = await userService.updateUserStatus(req.params.id, status);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      data: user,
      message: 'User status updated successfully',
      error: null
    });
  } catch (error) {
    console.error('Error in updateUserStatus:', error);
    
    if (error.message === 'User not found' || error.kind === 'ObjectId') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: null,
        message: 'User not found',
        error: error.message
      });
    }
    
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: 'Server Error while updating user status',
      error: error.message
    });
  }
};
