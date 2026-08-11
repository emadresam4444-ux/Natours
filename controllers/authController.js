const User = require('../models/userModel');
const asyncWrapper = require(`${__dirname}/../middleware/asyncWrapper`);
const AppError = require('../utils/AppError');
const jwt = require('jsonwebtoken');
const httpStatusText = require('../utils/httpStatusText');

const signToken = id => {
  return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '30d' });
};
const signup = asyncWrapper(async (req, res, next) => {
  const { name, email, photo, password, passwordConfirm } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) {
    return next(new AppError('User already exist', 400, httpStatusText.FAIL));
  }
  const user = await User.create({
    name,
    email,
    photo,
    password,
    passwordConfirm
  });
  const token = jwt.signToken(user._id);
  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, token, data: { user } });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('please Enter Email & Password ', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password))) {
    return next(new AppError('Invalid Email or Password ', 401));
  }
  const token = signToken(user._id);
  res.status(200).json({ status: httpStatusText.SUCCESS, token });
});

module.exports = { signup, login };
