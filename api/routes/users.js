import express from "express";
import {User, Playlist} from "../../db/mocks.js";

const router = express.Router();

/**
 * helper function to remove the password from a user object
 * @param {object} user - the user object.
 * @returns {object} the user object without the password
 */
const _sanitize = (user) => {
    const { password, ...rest } = user;
    return rest;
};


/**
 * @route POST /users/register
 * @desc Register a new user with a username and password
 * @param {Object} req.body - the request body.
 * @returns {Object} 201 - user object (sanitized)
 * @returns {Object} 400 - error if username or password missing
 */
router.post('/register', async (req,res) => {

    try {
        const {username, password} = req.body;

        //Check if the username and password are present
        if(!username || !password) {
            return res.status(400).json({ error: 'Username and password required to register.' });
        }

        const existingUser = User.find('username', username.toLowerCase());

        // Check if the inputted username exists in the database
        if(existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Add the following information to the database
        const registeredUser = User.add({
            username: username.toLowerCase(),
            password,
            registrationDate: new Date().toISOString()
        });

        res.status(201).json(_sanitize(registeredUser));

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to register user'});
    }

});

/**
 * @route POST /users/login
 * @desc Login a user by validating username and password
 * @param {Object} req.body - the request body
 * @returns {Object} 200 - user object (sanitized)
 * @returns {Object} 401 - Error if invalid credentials
 */
router.post('/login', async (req, res) => {

    try {
        const {username, password} = req.body;

        const user = User.find('username', username);

        // Check if the user and password correspond to the info from the database
        if(!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        res.json(_sanitize(user));

    } catch (error) {
        console.log(err);
        res.status(500).json({ error: 'Failed to login user' });
    }

    
});

/**
 * @route GET /users/:id
 * @desc Retrieves a user profile by id with associated playlists . Requires authorization header to match user id.
 * @param {string} id - user id from the URL
 * @returns {Object} 200 - user object with library (sanitized)
 * @returns {Object} 404 - user not found
 */
router.get('/:id', async (req, res) => {
        
    try {

        const {id } = req.params;

        const populatedUser = Playlist.populate(parseInt(id));

        if(!populatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(_sanitize(populatedUser));

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to get user with genre library' });
    }

});
export default router;