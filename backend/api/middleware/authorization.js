import { verifyToken } from '../util/auth.js'

import User from '../models/users.js'

/**
 * Express middleware that verifies the Bearer token in the Authorization header.
 * On success, attaches the authenticated user document to `req.user` and calls `next()`.
 *
 * @async
 * @function verifyUser
 * @param {import('express').Request}  req  - Express request; expects `Authorization: Bearer <token>` header.
 * @param {import('express').Response} res  - Express response object.
 * @param {import('express').NextFunction} next - Calls the next middleware when authentication succeeds.
 * @returns {Promise<void>} Resolves by calling `next()` on success, or sends a 401/404/500 error response.
 */
const verifyUser = async (req, res, next) => {
    const { authorization } = req.headers;

    try {

        if(!authorization) {
            return res.status(401).json({ error: "Unauthorized: no token provided "})
        }

        const [token_type, token] = authorization.split(' ');

        if (token_type !== 'Bearer' || !token) {
            return res.status(401).json({ error: 'Unauthorized: invalid token format' });
        }

        const verified = verifyToken(token);
        if( !verified) {
            return res.status(401).json({ error: 'Unauthorized: token is invalid or expired' });
        }

        const user = await User.findById(verified._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        req.user = user;

        next(); 

    } catch(error) {
        res.status(500).json({ error: error.toString() })
    }
};

export { verifyUser };