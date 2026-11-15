import env from '../config/env.js';

const errorHandler = (error, _req, res, _next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal server error';
  let details = error.details;

  if (error.name === 'ValidationError' && error.errors) {
    statusCode = 400;
    message = 'Validation failed';
    details = Object.values(error.errors).map((item) => ({
      field: item.path,
      message: item.message,
    }));
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for ${error.path}`;
  } else if (error.code === 11000) {
    statusCode = 409;
    message = 'Duplicate value';
    details = error.keyValue;
  } else if (error.name === 'MongooseServerSelectionError' || error.name === 'MongoServerError') {
    statusCode = 503;
    message = 'Database is unavailable';
  }

  if (statusCode >= 500) {
    console.error(error);
  }

  const payload = { success: false, message };
  if (details) {
    payload.details = details;
  }
  if (env.nodeEnv === 'development' && statusCode >= 500) {
    payload.stack = error.stack;
  }

  res.status(statusCode).json(payload);
};

export default errorHandler;
