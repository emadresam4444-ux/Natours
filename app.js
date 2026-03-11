const express = require('express');
const morgan = require('morgan');
const globalErrorHandler = require(`${__dirname}/controllers/errorController`);
const AppError = require(`${__dirname}/utils/AppError`);
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/tour', tourRouter);
app.use('/api/v1/user', userRouter);
app.all('*', (req, res, next) => {
  //  res.status(404).json({status:'fail',message:`Can't find ${req.originalUrl}`})
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);
module.exports = app;
