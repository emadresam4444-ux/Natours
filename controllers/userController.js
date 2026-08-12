const User = require('../models/userModel');
const asyncWrapper = require('../middleware/asyncWrapper');
const httpStatusText = require('../utils/httpStatusText');
const getAllUsers = asyncWrapper(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: users
  });
});
const getUser = asyncWrapper(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
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
