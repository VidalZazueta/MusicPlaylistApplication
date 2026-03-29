import { jwtDecode} from "jwt-decode";

/**
 * Checks whether a JWT token is expired or structurally invalid.
 *
 * Decodes the token and compares its `exp` claim against the current time.
 * Returns `true` if the token cannot be decoded (malformed/tampered).
 *
 * @param {string} token - The JWT string to check.
 * @returns {boolean} `true` if expired or invalid, `false` if still valid.
 */
export function isTokenExpired(token) {
    try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;

        return decoded.exp < now;
    } catch {
        // Expired token condition
        return true;
    }
}