import { Navigate } from "react-router-dom";
import { isTokenExpired } from "../util/auth";

/**
 * @description Protect routes that need authentication. Redirects to login page if no JWT is present
 * @param {Object} children - The item inside the components closing tag, in this case a route that we want to protect
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