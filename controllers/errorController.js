const AppError = require(`${__dirname}/../utils/AppError`);

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
};

const handleDuplicateFieldsDB = err => {
  const value = Object.values(err.keyValue || {})[0] || 'unknown value';
  const field = Object.keys(err.keyPattern || {})[0] || 'field';
  const message = `Duplicate ${field} value: "${value}". Please use another value!`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = err => {
  const value = Object.values(err.errors)
    .map(el => el.message)
    .join('. ');
  const message = `Invalid input data. ${value}`;
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }
  if (process.env.NODE_ENV === 'production') {
    let error = JSON.parse(JSON.stringify(err));
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
};
