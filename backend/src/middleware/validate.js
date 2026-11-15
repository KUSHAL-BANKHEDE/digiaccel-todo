import { ZodError } from 'zod';
import ApiError from '../utils/ApiError.js';

const validate = (schema, source = 'body') => (req, _res, next) => {
  try {
    const data = schema.parse(req[source] ?? {});

    if (!req.validated) {
      req.validated = {};
    }
    req.validated[source] = data;

    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const details = error.issues.map((issue) => ({
        field: issue.path.join('.') || source,
        message: issue.message,
      }));

      return next(new ApiError(400, 'Validation failed', details));
    }

    next(error);
  }
};

export default validate;
