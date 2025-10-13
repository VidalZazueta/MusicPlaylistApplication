import express from "express";
import { Playlist } from "../../db/mocks.js";

const router = express.Router();


/**
 * @route POST /playlists
 * @desc Create a playlist for the associated user
 * @param {Object} req.body - the request body
 * @header {string} authorization - authorization header matching with the user id
 * @returns {Object} 200 - playlist object
 * @returns {Object} 401 - forbidden if authorization fails
 */ 

router.post('/' , async (req, res) =>{

    const {title} = req.body;
    const userId = req.headers.authorization;

    // Check if the user is logged in
    if(!userId) {
            return res.status(401).json({ error: 'User login is required' });
    }

    // check if the playlist title is present
    if(!title) {
        return res.status(400).json({error: 'A title is required'})
    }

    if(!userId) {
        return res.status(400).json({error: 'A userId is required'});
    }

    try {
        // Create the new playlist and insert it to the users playlists
        const newPlaylist = Playlist.insert({
            userID: parseInt(userId),
            title,
            tracks: []
        });

        res.status(201).json(newPlaylist);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Creating playlist has failed'});
    }

});

/**
 * @route GET /playlists
 * @desc Get all playlists from the associated userId
 * @header {string} authorization - authorization header with value matching user id
 * @returns {Object} 200 - An array of playlists
 * @returns {Object} 404 - No playlists found for the user
 * @returns {Object} 401 - error if authorization fails
 */
router.get('/', async (req, res) => {

    try {

        const userId = req.headers.authorization;

        //Check if the user is logged in
        if(!userId) {
            return res.status(401).json({ error: 'User login is required' });
        }

        const playlists = Playlist.playlists.filter((p) => p.user_id === parseInt(userId));

        if(playlists.length === 0) {
            return res.status(404).json({error: 'No playlists found for this user'})
        }

        res.json({playlists});
    } catch(error) {
        console.log(error);
        res.status(500).json({error: 'Failed to get playlists'})
    }

});

/**
 * @route POST /playlists/:id/tracks
 * @desc add a track to the associated playlist id
 * @param {string} id - playlist id
 * @param {Object} req.body - the request body with the track info
 * @header {string} authorization - authorization header with the user id
 * @returns {Object} 200 - updated playlist
 * @returns {Object} 401 - error if authorization fails
 * @returns {Object} 404 - error if playlist not found
 * @returns {Object} 403 - error if user has no playlist
 */
router.post('/playlists/:id/track', async (req, res) => {

    try {

        const { playlistID } = req.params;
        const {name, artist, album, mbid, image } = req.body;
        const userId = req.headers.authorization;

        //Check if the user is logged in
        if(!userId) {
            return res.status(401).json({ error: 'User login is required' });
        }

        // Check if the following parameters are present
        if(!name || !artist || !mbid) {
            return res.status(400).json({ error: 'Track name, artist, and mbid are required' });
        }

        const playlist = Playlist.find('_id', parseInt(id));

        // Check if there is a playlist
        if(!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }

        // Check if the authorization matches to the user id
        if(playlist.user_id !== parseInt(userId)) {
            return res.status(403).json({ error: 'Forbidden: You are not authorized to modify this playlist' });
        }

        const track = {
            name,
            artist,
            album,
            mbid,
            image
        };

        //Add the track to the playlist
        const updatedPlaylist = Playlist.addToSet(parseInt(id), track)
        res.json(updatedPlaylist);
    } catch(error) {
        console.log(error);
        res.status(500).json({error: 'Failed to add track playlist'})
    }
});


/**
 * @route DELETE /playlist/:id
 * @desc delete a playlist from a user
 * @param {string} id = playlist id from the URL
 * @header {string} authorization - authorization header with value matching user id
 * @returns {Object} 200 - success object
 * @returns {Object} 403 - forbidden if authorization fails
 * @returns {Object} 404 - error if playlist not found
 */
router.delete('/:id', async (req, res) => {

    const {id} = req.params;

    const userId = req.headers.authorization;

    //Check if the user is logged in
    if(!userId){
        return res.status(401).json({ error: 'User login is required' });

    }

    try {

        const playlist = Playlist.find('_id', parseInt(id));

        // Check if the playlist exists
        if(!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }

        if(playlist.user_id !== parseInt(userId)) {
            return res.status(403).json({ error: 'Forbidden: You are not authorizaed to change this playlist'})
        }

        const deleted = Playlist.delete(parseInt(id));

        res.json(deleted);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An unexpected error occurred.' });

    }

});



export default router;