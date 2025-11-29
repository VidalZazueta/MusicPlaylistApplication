import express from 'express';
import Playlist from '../models/playlists.js';
import { verifyUser } from '../middleware/authorization.js';

const router = express.Router();

// Protected the route with the middleware by verifying the user
router.use(verifyUser)

/**
 * @route   POST /playlist
 * @description Creates a new, empty playlist for the authenticated user
 * @header  {string} Authentication - the user's unique _id
 * @body    {string} title - the title for the new playlist
 *
 * @returns {Object} 201 - the newly created playlist object
 */
router.post('/', async(req, res) => {
    try {

        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ error: 'Playlist title is required.' });
        }

        const newPlaylist = await Playlist.create({
            title: title.toLowerCase(),
            user_id: req.user._id
        });

        res.status(201).json(newPlaylist);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create playlist' });
    }
});

/**
 * @route   GET /playlists
 * @description Gets all playlists belonging to the currently authenticated user
 * @header  {string} Authentication - the user's unique _id
 *
 * @returns {Array<Object>} 200 - an array of the user's playlist objects

 */
router.get('/', async (req, res) => {
    try {

        // User should be verified so no need to validate
        const userId = req.user._id;

        const playlists = await Playlist.find({ user_id: userId});
        res.status(200).json(playlists);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to get playlist' });
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
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const track = req.body;

        const required = ['name', 'mbid'];
        const missingFields = required.filter(field => !track[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: `Missing required track fields: ${missingFields.join(', ')}`
            });
        }

        const playlist = await Playlist.findById(id);
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found.' });
        }

        //Check if playlist belongs to user
        if (playlist.user_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'You do not have permission to modify this playlist.' });
        }

        // Add track
        playlist.tracks.push(track);
        await playlist.save();

        res.json(playlist);
    } catch (err) {
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
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const playlist = await Playlist.findById(id);
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found.' });
        }

        if (playlist.user_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Forbidden: You do not own this playlist.' });
        }

        await Playlist.findByIdAndDelete(id);

        res.status(200).json({
            message: 'Playlist deleted successfully.',
            playlist
        });

    } catch (err) {
        res.status(500).json({ error: 'Failed to delete playlist' });
    }
});

export default router;
