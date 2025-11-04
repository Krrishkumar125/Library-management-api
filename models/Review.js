const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment'],
    minlength: [10, 'Comment must be at least 10 characters'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  helpful: {
    type: Number,
    default: 0,
    min: [0, 'Helpful count cannot be negative']
  },
  unhelpful: {
    type: Number,
    default: 0,
    min: [0, 'Unhelpful count cannot be negative']
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

reviewSchema.index({ book: 1, user: 1 });
reviewSchema.index({ book: 1, rating: 1 });

reviewSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('rating')) {
    const Book = require('./Book');
    const reviews = await mongoose.model('Review').find({ book: this.book });
    
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0) + this.rating;
      const averageRating = (totalRating / (reviews.length + 1)).toFixed(2);
      
      await Book.findByIdAndUpdate(this.book, {
        averageRating: parseFloat(averageRating),
        reviewCount: reviews.length + 1
      });
    }
  }
  next();
});

module.exports = mongoose.model('Review', reviewSchema);
