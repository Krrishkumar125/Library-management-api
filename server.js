const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { StatusCodes } = require('http-status-codes');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/books', require('./routes/book.routes'));
app.use('/api/authors', require('./routes/author.routes'));

app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Library Management System API',
    version: '1.0.0'
  });
});

app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    data: null,
    message: 'Route not found',
    error: 'The requested endpoint does not exist'
  });
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    console.error('Bad JSON:', error);
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      data: null,
      message: 'Invalid JSON format in request body',
      error: error.message
    });
  }
  next();
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});