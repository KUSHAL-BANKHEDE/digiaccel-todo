import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import env from './config/env.js';
import taskRoutes from './routes/taskRoutes.js';
import ensureDb from './middleware/ensureDb.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import ApiError from './utils/ApiError.js';
import isAllowedOrigin from './utils/origin.js';

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin, env.clientOrigins)) {
        return callback(null, true);
      }

      return callback(new ApiError(403, `Origin ${origin} is not allowed by CORS`));
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);

if (env.nodeEnv !== 'test') {
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
}

app.use(
  '/api',
  rateLimit({
    windowMs: env.rateLimitWindowMs,
    max: env.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' },
  })
);

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'To-Do API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use('/api/tasks', ensureDb, taskRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
