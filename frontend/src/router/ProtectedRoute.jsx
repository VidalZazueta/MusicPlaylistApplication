import { Navigate } from "react-router-dom";

/**
 * @description Protect routes that need authentication. Redirects to login page if no JWT is present
 * @param {children} - The item inside the components closing tag, in this case a route that we want to protect
 */

function ProtectedRoute({ children })  {

    const token = localStorage.getItem("token");

    if(!token) {
        return <Navigate to="/login" replace />
    }

    return children;
}

export default ProtectedRoute;