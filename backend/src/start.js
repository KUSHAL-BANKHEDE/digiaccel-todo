import mongoose from 'mongoose';
import env from './config/env.js';
import connectDB from './config/db.js';
import app from './app.js';

const startServer = async () => {
  await connectDB();

  const server = app.listen(env.port, () => {
    console.log(`API server running in ${env.nodeEnv} mode on port ${env.port}`);
  });

  const shutdown = (signal) => {
    console.log(`\n${signal} received. Closing server...`);

    server.close(async () => {
      await mongoose.connection.close();
      console.log('HTTP server and database connection closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled promise rejection:', reason);
    shutdown('unhandledRejection');
  });
};

startServer().catch((error) => {
  console.error('Failed to start API server:', error.message);
  process.exit(1);
});
