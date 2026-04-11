import 'dotenv/config';
import mongoose from 'mongoose';

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;

// MONGO_URI can be set directly (e.g. in CI with a local MongoDB container).
// Falls back to the Atlas connection string built from individual env vars.
const MONGO_URI = process.env.MONGO_URI ||
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_URL}/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;


/**
 * Establishes a connection to MongoDB using the URI assembled from environment variables.
 * Logs a success message on connection. Logs the error and exits the process (`process.exit(1)`)
 * if the connection fails, preventing the app from starting in a broken state.
 *
 * @async
 * @function connect
 * @returns {Promise<void>} Resolves when the connection is established.
 */
const connect = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }

};

/**
 * Closes the active Mongoose connection to MongoDB.
 * Logs a success message on clean disconnect. Logs the error (but does not exit)
 * if disconnection fails.
 *
 * @async
 * @function disconnect
 * @returns {Promise<void>} Resolves when the connection is closed.
 */
const disconnect = async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB successfully disconnected')
    } catch (error) {
        console.error('MongoDB disconnection error', error)
    }
};


export {connect, disconnect}