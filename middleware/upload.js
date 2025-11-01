const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createStorage = (uploadPath) => {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const prefix = uploadPath.includes('profile') ? 'profile-' : 'book-';
      cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
    }
  });
};

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed!'));
  }
};

const bookCoverUpload = multer({
  storage: createStorage('./uploads/book-covers'),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
});

const profilePictureUpload = multer({
  storage: createStorage('./uploads/profile-pictures'),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: fileFilter
});

module.exports = {
  bookCoverUpload,
  profilePictureUpload
};
