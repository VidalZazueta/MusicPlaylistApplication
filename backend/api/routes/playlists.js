import express from 'express';
import Playlist from '../models/playlists.js';
import { verifyUser } from '../middleware/authorization.js';

const router = express.Router();

// Protected the route with the middleware by verifying the user
router.use(verifyUser)


/**
 * @route   POST /playlists
 * @description Creates a new, empty playlist for the authenticated user.
 * @access  Protected — requires `Authorization: Bearer <token>` header.
 *
 * @body    {string} title - The title for the new playlist (required).
 *
 * @returns {Object} 201 - The newly created playlist document.
 * @returns {Object} 400 - Error if `title` is missing from the request body.
 * @returns {Object} 500 - Error if the playlist could not be created.
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
 * @description Retrieves all playlists belonging to the currently authenticated user.
 * @access  Protected — requires `Authorization: Bearer <token>` header.
 *
 * @returns {Array<Object>} 200 - An array of the user's playlist documents (may be empty).
 * @returns {Object} 500 - Error if the database query fails.
 */
router.get('/', async (req, res) => {
    try {

        // Verify user
        const userId = req.user._id;

        const playlists = await Playlist.find({ user_id: userId});

        res.status(200).json(playlists);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to get playlists' });
    }
});

/**
 * @route   GET /playlists/:id
 * @description Retrieves a single playlist by ID, scoped to the authenticated user.
 * @access  Protected — requires `Authorization: Bearer <token>` header.
 *
 * @param   {string} id - The MongoDB `_id` of the playlist to retrieve.
 *
 * @returns {Object} 200 - The matching playlist document.
 * @returns {Object} 404 - Error if no playlist with the given ID exists for this user.
 * @returns {Object} 500 - Error if the database query fails.
 */
router.get("/:id", async (req, res) => {

    try {
        const { id } = req.params;

        const playlist = await Playlist.findOne({
            _id: id,
            user_id: req.user._id
        })

        if(!playlist) {
            return res.status(404).json({ error: "Playlist not found" });
        }

        res.json(playlist);

    } catch(error) {
        res.status(500).json({ error: "Failed to fetch playlist" });
    }
})

/**
 * @route   PUT /playlists/:id
 * @description Adds a track to an existing playlist owned by the authenticated user.
 * @access  Protected — requires `Authorization: Bearer <token>` header.
 *
 * @param   {string} id    - The MongoDB `_id` of the playlist to update.
 * @body    {Object} track - The track object to append (must include `name` and `mbid`).
 *
 * @returns {Object} 200 - The updated playlist document including the newly added track.
 * @returns {Object} 400 - Error if required track fields (`name`, `mbid`) are missing.
 * @returns {Object} 403 - Error if the playlist does not belong to the authenticated user.
 * @returns {Object} 404 - Error if no playlist with the given ID is found.
 * @returns {Object} 500 - Error if the update fails.
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
 * @route   DELETE /playlists/:id
 * @description Deletes a specific playlist owned by the authenticated user.
 * @access  Protected — requires `Authorization: Bearer <token>` header.
 *
 * @param   {string} id - The MongoDB `_id` of the playlist to delete.
 *
 * @returns {{message: string, playlist: Object}} 200 - Confirmation message and the deleted playlist document.
 * @returns {Object} 403 - Error if the playlist does not belong to the authenticated user.
 * @returns {Object} 404 - Error if no playlist with the given ID is found.
 * @returns {Object} 500 - Error if the deletion fails.
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
