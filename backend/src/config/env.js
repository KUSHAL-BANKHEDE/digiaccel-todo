import 'dotenv/config';

const DEFAULT_CLIENT_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
];

const parseOrigins = (value) =>
  (value || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5001,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/digiaccel_todo',
  clientOrigins: parseOrigins(process.env.CLIENT_ORIGINS).length
    ? parseOrigins(process.env.CLIENT_ORIGINS)
    : DEFAULT_CLIENT_ORIGINS,
  rateLimitWindowMs: 15 * 60 * 1000,
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 500,
};

export default env;
