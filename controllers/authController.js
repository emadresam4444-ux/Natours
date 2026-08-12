const User = require('../models/userModel');
const asyncWrapper = require('../middleware/asyncWrapper');
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

const protect = asyncWrapper(async (req, res, next) => {
  let token;
  if(!req.headers.authorization){
    return next(new AppError('Please login', 401));
  }
  const authorization = req.headers.authorization;
  if (authorization && authorization.startsWith('Bearer')) {
     token = authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('Please login', 401));
  }
  const decoded =await jwt.verify(token, process.env.SECRET_KEY);
  console.log(decoded);
  req.id=decoded.id;
  
  next()
});

module.exports = { signup, login, protect };
