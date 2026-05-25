import express from 'express';
import 'dotenv/config';

import playlists from './api/routes/playlists.js';
import tracks from './api/routes/tracks.js';
import users from './api/routes/users.js';
import lastfm from './api/routes/lastfm.js';
import {connect, disconnect} from './db/connections.js'
import cors from 'cors';

const PORT = 8888;

const app = express();


app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse incoming json requests
app.use(express.json());

// Route handlers
app.use('/playlists', playlists);
app.use('/tracks', tracks);
app.use('/users', users);
app.use('/lastfm', lastfm);


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
