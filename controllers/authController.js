const userModel = require(`${__dirname}/../models/userModel`);
const asyncWrapper = require(`${__dirname}/../middleware/asyncWrapper`);
const AppError = require(`${__dirname}/../utils/AppError`);
const {
  SUCCESS,
  ERROR,
  FAIL
} = require(`${__dirname}/../utils/httpStatusText`);
const signup = asyncWrapper(async (req, res, next) => {
  const { name, email, photo, password, passwordConfirm } = req.body;

  const userExist = await userModel.findOne({ email });
  if (userExist) {
    return next(new AppError('User already exist', 400, httpStatusText.FAIL));
  }
  const user = await userModel.create({
    name,
    email,
    photo,
    password,
    passwordConfirm
  });

  res.status(201).json({ status: SUCCESS, data: { user } });
});
module.exports = { signup };
