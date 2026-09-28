import mongoose from "mongoose";
import config from './config.js';

let connectionPromise;

const connectDb = async () => {
  if (mongoose.connection.readyState === 1) return;

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(config.MONGO_URI).catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  }

  try {
    await connectionPromise;
    console.log("MongoDB connected successfully");
  }catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

export default connectDb;