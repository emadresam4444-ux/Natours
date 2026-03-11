const AppError = require(`${__dirname}/../utils/AppError`);
module.exports = asyncFN => {
  return (req, res, next) => {
    asyncFN(req, res, next).catch(err => next(new AppError(err.message,400)));
  };
};
