import mongoose from 'mongoose';
import ApiError from '../utils/ApiError.js';

const validateObjectId = (param = 'id') => (req, _res, next) => {
  if (!mongoose.isValidObjectId(req.params[param])) {
    return next(new ApiError(400, 'Invalid task id'));
  }

  next();
};

export default validateObjectId;
