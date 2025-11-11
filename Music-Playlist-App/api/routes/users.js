import express from 'express';

import { User } from '../../db/mock_db.js';

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
 * @description Registers a new user with username, password
 * @param {Object} req.body - the request body
 *
 * @returns {Object} 201 - user object (sanitized)
 */
router.post('/register', (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
        }

        const existing = User.find('username', username);
        if (existing) {
            return res.status(409).json({ error: 'Username already exists.' });
        }

        const user = {
            username,
            password,
            registrationDate: Date.now()
        };
        const addedUser = User.add(user);

        res.status(201).json(_sanitize(addedUser));
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
router.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;

        const user = User.find('username', username);

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        res.json(_sanitize(user));
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
router.get('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.headers.authorization;

        if (!userId) {
            return res.status(401).json({ error: 'Authorization header not present.' });
        }

        if (id !== userId) {
            return res.status(403).json({ error: 'Forbidden. You are not authorized to view this user.' });
        }

        const user = User.find('_id', parseInt(id));
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.json(_sanitize(user));
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to get user' });
    }
});

export default router;
