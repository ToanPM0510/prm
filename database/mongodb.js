import mongoose from "mongoose";
import { DB_URI } from "../config/env.js";

if (!DB_URI) {
  throw new Error("DB_URI is not defined");
}

// Global variable to cache the connection
let cachedConnection = null;
let isConnecting = false; // Track connection state


const connectToDatabase = async () => {
  // If already connected, return cached connection
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  // If a connection is in progress, wait for it
  if (isConnecting) {
    while (isConnecting) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    if (cachedConnection && mongoose.connection.readyState === 1) {
      return cachedConnection;
    }
  }

  isConnecting = true;
  try {
    mongoose.set('bufferCommands', false);
    const options = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 5,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      w: 'majority'
    };

    // Disconnect if not disconnected
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    cachedConnection = await mongoose.connect(DB_URI, options);

    // Only attach listeners once
    if (!mongoose.connection._hasCustomListeners) {
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
        cachedConnection = null;
      });
      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
        cachedConnection = null;
      });
      mongoose.connection._hasCustomListeners = true;
    }

    return cachedConnection;
  } catch (error) {
    cachedConnection = null;
    throw new Error(`Database connection failed: ${error.message}`);
  } finally {
    isConnecting = false;
  }
};

export default connectToDatabase;
