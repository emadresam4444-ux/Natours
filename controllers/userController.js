const User = require('../models/userModel');
const asyncWrapper = require('../middleware/asyncWrapper');
const getAllUsers = asyncWrapper(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: 'error',
    data: users
  });
});
const getUser = asyncWrapper(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  res.status(200).json({
    status: 'error',
    data: user
  });
});
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
module.exports = { getAllUsers, getUser, createUser, updateUser, deleteUser };
