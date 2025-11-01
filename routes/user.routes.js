const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  uploadProfilePicture,
  getUsersByRole,
  updateUserStatus
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth');
const { profilePictureUpload } = require('../middleware/upload');

router.use(protect);

router.get('/', getUsers);
router.get('/role/:role', getUsersByRole);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.patch('/upload-profile-picture', profilePictureUpload.single('profilePicture'), uploadProfilePicture);
router.patch('/:id/status', updateUserStatus);

module.exports = router;
