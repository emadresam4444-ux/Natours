const express = require('express');
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('./../controllers/userController');
const {
  signup,
  login,
  protect,
  forgetPassword,
  resetPassword
} = require(`${__dirname}/../controllers/authController`);
const router = express.Router();

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/forgetPassword').post(forgetPassword);
router.route('/resetPassword').post(resetPassword);
router
  .route('/')
  .get(protect, getAllUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
