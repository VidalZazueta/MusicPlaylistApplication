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
 * @route POST /users/register
 * @description Registers a new user with username, password
 * @param {Object} req.body - the request body
 *
 * @returns {Object} 201 - user object (sanitized)
 * @returns {Object} 400 - eror if username or password missing
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
 * @route POST /users/login
 * @description Login a user by validating username and password
 * @param {Object} req.body - the request body
 *
 * @returns {Object} 200 - user object (sanitized)
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username: username.toLowerCase() });
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
 * @route GET /users/:id
 * @description Retrieves a private user profile by _id
 * @param {string} id - user _id from the URL
 * @header  {string} Authentication - the user's unique _id
 *
 * @returns {Object} 200 - user object (sanitized)
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
