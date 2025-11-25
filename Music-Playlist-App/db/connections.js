import 'dotenv/config';
import mongoose from 'mongoose';

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;


/**
 * Connect to MongoDB
 * Create the mongo URI and connect to the database with mongoose
 */
const connect = async () => {
    try {
        const MONGO_URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_URL}/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }

};

/**
 * Disconnect from MongoDB
 * Disconnect the connection when done
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