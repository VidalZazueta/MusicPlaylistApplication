import express from 'express';
import 'dotenv/config';

import playlists from './api/routes/playlists.js';
import tracks from './api/routes/tracks.js';
import users from './api/routes/users.js';
import {connect, disconnect} from './db/connections.js'
import cors from 'cors';

const PORT = 8888;

const app = express();


app.use(cors({
  origin: 'http://localhost:5173', // Vite default
  credentials: true
}));

// Parse incoming json requests
app.use(express.json());

// Route handlers
app.use('/playlists', playlists);
app.use('/tracks', tracks);
app.use('/users', users);


const start = async () => {
  try {
    await connect();

    app.listen(PORT, () => {
      console.log(`Server listening on port: ${PORT}`);
    });


  } catch(error) {
    // Log error and exit if the server fails to start
    console.error('Failed to start server:', error.message)
    process.exit(1);
  }

};

const shutdown = async () => {
  console.log('\nShutting down...');
  await disconnect();
  process.exit(0);

};

// Listen for the SIGTERM signal - common sources of sigterm include docker stopping a container
process.on('SIGTERM', shutdown);

// Listen for SIGINT signal (sent when user presses Ctrl+C in the terminal)
process.on('SIGINT', shutdown);

start();

//TODO Need to update the playlists and tracks routes to use the models schema and connect to mongodb

//Completed 1. Password Hashing with bcrypt, hashing password before storing, and comparing password when logging in
//Completed 2. JWT for Login, create a JWT that includes user id, and send it back to the client
//Completed 3. Middleware for Protected routes, client send JWT in the authorization header as a bearer token,
//Completed - created a middleware function to check and verify JWT

//Completed - User route with MongoDB connection
//TODO - Update playlist route
//TODO - update tracks route