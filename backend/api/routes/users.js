import express from 'express';

import { hash, compare, signToken} from '../util/auth.js'
import { verifyUser } from '../middleware/authorization.js';

import User from '../models/users.js'

const router = express.Router();

/**
 * helper function to remove the password from a user object
 * @param {object} user - the user object.
 * @returns {object} the user object without the password
 */
const _sanitize = (user) => {
    const userObj = user.toObject ? user.toObject(): user;
    const { password, ...rest } = userObj;
    return rest;
};

/**
 * @route   POST /users/register
 * @description Registers a new user with a username and password.
 *              The password is hashed before storage; the password field is stripped from the response.
 *
 * @body    {string} username - The desired username (stored in lowercase, must be unique).
 * @body    {string} password - The plain-text password to hash and store.
 *
 * @returns {Object} 201 - The newly created user document (password omitted).
 * @returns {Object} 400 - Error if `username` or `password` is missing, or if the username already exists.
 * @returns {Object} 500 - Error if registration fails.
 */
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
        }

        const existing = await User.findOne({ username: username.toLowerCase() });
        if (existing) {
            return res.status(400).json({ error: 'Username already exists.' });
        }

        // Hash the password
        const hashedPassword = await hash(password);

        // Save the hashed password to the database
        const registeredUser = await User.create({
            username: username.toLowerCase(),
            password: hashedPassword,
            registrationDate: Date.now(),
        });

        res.status(201).json(_sanitize(registeredUser));
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

/**
 * @route   POST /users/login
 * @description Authenticates a user by validating their username and password.
 *              Returns a signed JWT on success.
 *
 * @body    {string} username - The user's username.
 * @body    {string} password - The user's plain-text password to verify against the stored hash.
 *
 * @returns {{access_token: string, token_type: string, user: Object}} 200 - Bearer token and sanitized user object.
 * @returns {Object} 401 - Error if the username is not found or the password is incorrect.
 * @returns {Object} 500 - Error if login fails.
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;


        const user = await User.findOne({ username: username.toLowerCase() });
        if(!user) {
            return res.status(401).json({ error: "Invalid username" })
        }

        const validPassword = user && (await compare(password, user.password));
        // Check if the password is valid after comparing it 
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        const token = signToken({ username: user.username, _id: user._id });
        res.json({
            access_token: token,
            token_type: 'Bearer',
            user: _sanitize(user)
        });
    
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to login user' });
    }
});

/**
 * @route   GET /users/:id
 * @description Retrieves the authenticated user's profile by their MongoDB `_id`.
 *              Optionally populates the user's playlists when requested.
 * @access  Protected — requires `Authorization: Bearer <token>` header.
 *
 * @param        {string}  id               - The MongoDB `_id` of the user to retrieve (must match the authenticated user).
 * @queryparam   {boolean} [playlists=false] - When `true`, includes the user's playlist documents in the response.
 *
 * @returns {Object} 200 - Sanitized user document (password omitted), with playlists array if requested.
 * @returns {Object} 403 - Error if the authenticated user is trying to access another user's profile.
 * @returns {Object} 404 - Error if the user is not found.
 * @returns {Object} 500 - Error if the query fails.
 */
router.get('/:id', verifyUser, async (req, res) => {
    try {
        const { id } = req.params;
        const { playlists } = req.query;

        //Only the use can access their profile
        if (req.user._id.toString() !== id) {
            return res.status(403).json({ error: 'Forbidden. You are not authorized to view this user.' });
        }

        if (playlists !== 'true') {
            return res.json(_sanitize(req.user));
        }

        // Populate playlists if request
        const userWithPlaylists = await User.findById(id).populate('playlists');

        if(!userWithPlaylists) {
            return res.status(404).json({ error: "User not found "});
        }

        return res.json(_sanitize(userWithPlaylists));
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to get user by id' });
    }
});

export default router;
