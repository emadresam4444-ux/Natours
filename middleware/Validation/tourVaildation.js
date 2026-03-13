const mongoose = require('mongoose');
const AppError = require(`${__dirname}/../../utils/AppError.js`);
validID = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new AppError('Invalid Tour ID', 400));
  }
  next();
};
const handleDuplicateFieldsDB = err => {
  const message = `Duplicate field value(s) detected: ${duplicateFields}. Please use different value(s)!`;
  return new AppError(message, 400);
};
module.exports = { validID, handleDuplicateFieldsDB };
