const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a book title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  author: {
    type: String,
    required: [true, 'Please add an author name'],
    trim: true
  },
  isbn: {
    type: String,
    required: [true, 'Please add an ISBN'],
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'History', 'Biography', 'Other']
  },
  publisher: {
    type: String,
    trim: true
  },
  publishedYear: {
    type: Number,
    min: [1000, 'Please enter a valid year'],
    max: [new Date().getFullYear(), 'Year cannot be in the future']
  },
  pages: {
    type: Number,
    min: [1, 'Pages must be at least 1']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  availableCopies: {
    type: Number,
    required: [true, 'Please add number of available copies'],
    min: [0, 'Available copies cannot be negative'],
    default: 1
  },
  totalCopies: {
    type: Number,
    required: [true, 'Please add total number of copies'],
    min: [1, 'Total copies must be at least 1'],
    default: 1
  },
  coverImage: {
    type: String,
    default: null
  },
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: [0, 'Review count cannot be negative']
  }
}, {
  timestamps: true
});

bookSchema.index({ title: 'text', author: 'text', category: 1 });

module.exports = mongoose.model('Book', bookSchema);