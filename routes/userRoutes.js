const express = require('express');
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('./../controllers/userController');
const { signup,login,protect } = require(`${__dirname}/../controllers/authController`);
const router = express.Router();

router.route('/signup').post(signup);
router.route('/login').post(login);
router
  .route('/')
  .get(protect,getAllUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
