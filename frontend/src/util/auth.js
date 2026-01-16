import { jwtDecode} from "jwt-decode";

/**
 * @description Returns true if the token is expired or invalid
 * @param {token} - The JWT token
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