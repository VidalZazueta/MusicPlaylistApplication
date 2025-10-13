import express from 'express';
import 'dotenv/config';

import playlists from './api/routes/playlists.js';
import tracks from './api/routes/tracks.js';
import users from './api/routes/users.js';

const PORT = 8888;

const app = express();

app.use(express.json());

app.use('/playlists', playlists);
app.use('/tracks', tracks);
app.use('/users', users);

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});



// https://www.last.fm/api/intro
// Use this as the URL to make the calls to the API