import escapeRegex from './escapeRegex.js';

const isAllowedOrigin = (origin, allowedOrigins = []) => {
  if (!origin) {
    return true;
  }

  return allowedOrigins.some((allowedOrigin) => {
    if (allowedOrigin === '*') {
      return true;
    }

    const pattern = allowedOrigin
      .replace(/\/+$/, '')
      .split('*')
      .map(escapeRegex)
      .join('.*');

    return new RegExp(`^${pattern}$`, 'i').test(origin);
  });
};

export default isAllowedOrigin;
