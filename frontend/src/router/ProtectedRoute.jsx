import { Navigate } from "react-router-dom";
import { isTokenExpired } from "../util/auth";

/**
 * Route guard that requires a valid, non-expired JWT token in localStorage.
 *
 * If no token exists or the token is expired, it is removed from localStorage
 * and the user is redirected to `/login`. Otherwise, the child component is rendered.
 *
 * @param {Object} props
 * @param {JSX.Element} props.children - The protected page component to render if authenticated.
 * @returns {JSX.Element} The child component or a redirect to `/login`.
 */

function ProtectedRoute({ children })  {

    const token = localStorage.getItem("token");

    if(!token || isTokenExpired(token)) {
        localStorage.removeItem("token");
        return <Navigate to="/login" replace/>
    }

    return children;
}

export default ProtectedRoute;