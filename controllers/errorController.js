const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  // status: 400 - Bad request
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. PLease use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(eachError => eachError.message);
  const message = `Invalid Input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  return new AppError('Invalid token! Please login again', 401);
};

const handleJWTTokenExpiredError = () => {
  return new AppError('Your token had expired! Please login again.', 401);
};

const sendErrorDevelopment = (err, res) => {
  console.log('error ', err);
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProduction = (err, res) => {
  // 1.) Operational, trusted errors: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });

    // 2.) Programming or other unknown error: don't leak details to client
  } else {
    console.error('ERROR 💣', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDevelopment(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    switch (error.name || error.code) {
      case 'CastError':
        error = handleCastErrorDB(error);
        break;
      case 'ValidationError':
        error = handleValidationErrorDB(error);
        break;
      case 'JsonWebTokenError':
        error = handleJWTError();
        break;
      case 'TokenExpiredError':
        error = handleJWTTokenExpiredError();
        break;
      case 11000:
        error = handleDuplicateFieldsDB(error);
        break;
      default:
        break;
    }

    sendErrorProduction(error, res);
  }
};
