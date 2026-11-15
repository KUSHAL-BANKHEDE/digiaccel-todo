import mongoose from 'mongoose';
import env from './env.js';

let connectionPromise = null;

mongoose.connection.on('disconnected', () => {
  connectionPromise = null;
});

const connectDB = async () => {
  if (!env.mongoUri) {
    throw new Error('MONGODB_URI is not defined');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    mongoose.set('strictQuery', true);

    connectionPromise = mongoose
      .connect(env.mongoUri, {
        serverSelectionTimeoutMS: 10000,
      })
      .then((connection) => {
        console.log(
          `MongoDB connected: ${connection.connection.host}/${connection.connection.name}`
        );
        return connection;
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  return connectionPromise;
};

export default connectDB;
