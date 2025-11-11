import express from 'express';
import { Playlist } from '../../db/mock_db.js';

const router = express.Router();

/**
 * @route   GET /playlists
 * @description Gets all playlists belonging to the currently authenticated user
 * @header  {string} Authentication - the user's unique _id
 *
 * @returns {Array<Object>} 200 - an array of the user's playlist objects

 */
router.get('/', (req, res) => {
    try {
        const userId = req.headers.authorization;
        if (!userId) {
            return res.status(401).json({ error: 'Authorization header not present.' });
        }

        const populated = Playlist.populate(parseInt(userId, 10));

        res.json(populated);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to get playlist' });
    }
});

/**
 * @route   POST /playlist
 * @description Creates a new, empty playlist for the authenticated user
 * @header  {string} Authentication - the user's unique _id
 * @body    {string} title - the title for the new playlist
 *
 * @returns {Object} 201 - the newly created playlist object
 */
router.post('/', (req, res) => {
    try {
        const userId = req.headers.authorization;
        if (!userId) {
            return res.status(401).json({ error: 'Authorization header not present.' });
        }

        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ error: 'Playlist title is required.' });
        }

        const playlist = {
            user_id: parseInt(userId),
            title,
            tracks: []
        };
        const addedPlaylist = Playlist.insert(playlist);

        res.status(201).json(addedPlaylist);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create playlist' });
    }
});

/**
 * @route   PUT /playlist/:id
 * @description updates playlist by adding a track
 * @header  {string} Authentication - the user's unique _id
 * @param   {number} id - the _id of the playlist to update
 * @body    {Object} track - the full track object to add to the playlist
 *
 * @returns {Object} 200 - the entire playlist object, now updated with the new trackt
 */
router.put('/:id', (req, res) => {
    try {
        const { id } = req.params;

        const track = req.body;

        const userId = req.headers.authorization;
        if (!userId) {
            return res.status(401).json({ error: 'Authorization header not present.' });
        }

        const playlist = Playlist.find('_id', parseInt(id));
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found.' });
        }

        if (playlist.user_id !== parseInt(userId)) {
            return res.status(403).json({ error: 'You do not have permission to modify this playlist.' });
        }

        const updatedPlaylist = Playlist.addToSet(parseInt(id), track);
        res.json(updatedPlaylist);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to update playlist' });
    }
});

/**
 * @route   DELETE /playlist/:id
 * @description Deletes a specific playlist owned by the user
 * @header  {string} Authentication - the user's unique _id
 * @param   {number} id - the _id of the playlist to delete
 *
 * @returns {Object} 200 - a confirmation object { success: true, _id: 101 }.
 */
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;

        const userId = req.headers.authorization;
        if (!userId) {
            return res.status(401).json({ error: 'Authorization header not present.' });
        }

        const playlist = Playlist.find('_id', parseInt(id));
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found.' });
        }

        if (playlist.user_id !== parseInt(userId)) {
            return res.status(403).json({ error: 'You do not have permission to delete this playlist.' });
        }

        const result = Playlist.delete(parseInt(id));
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to delete playlist' });
    }
});

export default router;
