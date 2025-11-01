const User = require('../models/User');

class UserService {
  async getAllUsers(queryParams) {
    const { page = 1, limit = 10, name, email, role, membershipStatus } = queryParams;
    
    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (email) filter.email = { $regex: email, $options: 'i' };
    if (role) filter.role = role;
    if (membershipStatus) filter.membershipStatus = membershipStatus;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const totalUsers = await User.countDocuments(filter);
    
    const users = await User.find(filter)
      .select('-password')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });
    
    return {
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / parseInt(limit)),
        totalUsers,
        limit: parseInt(limit)
      }
    };
  }

  async getUserById(userId) {
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }

  async updateUser(userId, updateData) {
    if (updateData.password) {
      delete updateData.password;
    }
    
    if (updateData.email) {
      const existingUser = await User.findOne({ 
        email: updateData.email,
        _id: { $ne: userId }
      });
      
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }

  async deleteUser(userId) {
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }

  async uploadProfilePicture(userId, filePath) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    if (user.profilePicture) {
      const fs = require('fs');
      const oldPath = user.profilePicture;
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    
    user.profilePicture = filePath;
    await user.save();
    
    return user;
  }

  async getUsersByRole(role, queryParams) {
    const { page = 1, limit = 10 } = queryParams;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const users = await User.find({ role })
      .select('-password')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });
    
    const totalUsers = await User.countDocuments({ role });
    
    return {
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / parseInt(limit)),
        totalUsers,
        limit: parseInt(limit)
      }
    };
  }

  async updateUserStatus(userId, status) {
    const user = await User.findByIdAndUpdate(
      userId,
      { membershipStatus: status },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }
}

module.exports = new UserService();
