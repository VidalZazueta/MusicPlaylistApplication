import 'dotenv/config';
import mongoose from 'mongoose';

import User from './models/users.js';
import Playlist from './models/playlists.js';   

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
 * Run Script
 * Script to clean, query, and insert
 */

const runScript = async () => {
    try {
        await connect();

        // Clean the existing data
        console.log("Cleaning Database data...");
        await User.deleteMany({});
        await Playlist.deleteMany({});
        console.log("Database cleaned.");

        // Insert a new user in the database
        console.log("Inserting new user...");
        const newUser = await User.create({
            username: "vidal",
            password: "123"
        });
        console.log("New user inserted:", newUser);

        // Insert a new playlist for the user just created
        console.log("Inserting new playlist for the user:", newUser.username);


        await Playlist.create({
            user_id: newUser._id,
            title: 'Favorites',
            tracks: [
                {
                    name: "Bohemian Rhapsody",
                    artist: "Queen",
                    album: "Greatest Hits",
                    mbid: "b1c4b5e5-6e5e-4e5e-8e5e-b1a9c0e9-d987-4042-ae91-78d6a3267d69",
                    image: "https://lastfm.freetls.fastly.net/i/u/34s/1aec5cac8403fbda275b8200b77c8318.png"
                },
                {
                    mbid: 'Lang Lang|Empire State Of Mind',
                    name: 'Empire State Of Mind',
                    artist: 'Lang Lang',
                    album: 'Empire State Of Mind',
                    image: ''
                }

            ]


        });

        const userWithPlaylists = await User.findById(newUser._id).populate('playlists').select('-password');

        // Print the query to console
        console.log("Queried User with Playlists:", JSON.stringify(userWithPlaylists, null, 2));

    } catch (error) {
        console.error("Error running script:", error);
        process.exit(1);
        
    } finally {
        // Close the mongoose connection
        await mongoose.connection.close();
        console.log("MongoDB connection closed.");
    }


};

runScript();