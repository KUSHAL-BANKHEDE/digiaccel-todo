import connectDB from '../config/db.js';

const ensureDb = async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
};

export default ensureDb;
