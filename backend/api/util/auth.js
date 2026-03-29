import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Hashes a plain-text password using bcrypt with a salt cost factor of 10.
 *
 * @async
 * @param {string} password - The plain-text password to hash.
 * @returns {Promise<string>} Resolves to the bcrypt hash string (includes the embedded salt).
 */

const hash = async (password) => {
    // 1. Define the cost factor. The higher the number, the more computationally
    // expensive the hash, and the more resistant to brute-force attacks.
    // 10 is a good, recommended default in 2025.

    // Salt rounds control how many times bcrypt runs its hashing algorithm.
    // Higher rounds = stronger security but slower performance.
    // It’s called “rounds” because bcrypt mixes in random data (the salt)
    // multiple times to make the hash harder to crack.

    const rounds = 10;

    // Generate the salt. This is an asynchronous operation
    const salt = await bcrypt.genSalt(rounds)

    // Hash the password using the generated salt, also asynchronous
    const hashedPassword = await bcrypt.hash(password, salt)

    return hashedPassword;
}

/**
 * Compares a plain-text password against a bcrypt hash.
 * bcrypt automatically extracts the embedded salt from the stored hash for comparison,
 * so no separate salt argument is needed.
 *
 * @async
 * @param {string} password   - The plain-text password to check.
 * @param {string} dbPassword - The bcrypt hash retrieved from the database.
 * @returns {Promise<boolean>} Resolves to `true` if the password matches the hash, `false` otherwise.
 */
const compare = async (password, dbPassword) => {
    // Await the result of the async comparison
    return await bcrypt.compare(password, dbPassword);
};

/**
 * Signs a JWT with the given payload, using the `JWT_SECRET` environment variable.
 * The token expires after 24 hours.
 *
 * @param {{ _id: string, username: string }} payload - The data to encode in the token.
 * @returns {string} A signed JSON Web Token valid for 24 hours.
 */
const signToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

/**
 * Verifies a JWT against the `JWT_SECRET` environment variable.
 * Returns `null` instead of throwing when the token is invalid or expired,
 * so callers can treat falsy as an auth failure without try/catch.
 *
 * @param {string} token - The JWT string to verify.
 * @returns {{ _id: string, username: string, iat: number, exp: number } | null}
 *   The decoded payload if the token is valid and unexpired, otherwise `null`.
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

export { hash, compare, signToken, verifyToken };