const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add author name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  biography: {
    type: String,
    trim: true,
    maxlength: [2000, 'Biography cannot be more than 2000 characters']
  },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(value) {
        return value <= new Date();
      },
      message: 'Date of birth cannot be in the future'
    }
  },
  nationality: {
    type: String,
    trim: true,
    maxlength: [50, 'Nationality cannot be more than 50 characters']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  website: {
    type: String,
    trim: true,
    match: [
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      'Please add a valid URL'
    ]
  },
  photoUrl: {
    type: String,
    default: null
  },
  booksWritten: {
    type: Number,
    default: 0,
    min: [0, 'Books written cannot be negative']
  },
  awards: [{
    type: String,
    trim: true
  }],
  genres: [{
    type: String,
    enum: ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'History', 'Biography', 'Poetry', 'Drama', 'Other'],
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

authorSchema.index({ name: 'text', nationality: 1, isActive: 1 });

module.exports = mongoose.model('Author', authorSchema);
