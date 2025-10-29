const User = require('../models/User');

class AuthService {
  async register(userData) {
    const { name, email, password, role } = userData;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error('User already exists with this email');
    }
    
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });
    
    const token = user.getSignedJwtToken();
    
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    };
  }

  async login(email, password) {
    if (!email || !password) {
      throw new Error('Please provide email and password');
    }
    
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    
    const token = user.getSignedJwtToken();
    
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    };
  }

  async getMe(userId) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }
}

module.exports = new AuthService();
