import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

/*
BrowserRouter - Provides Routing context for the entire react app using the browser's History API
Without it, routing wint work at all. It Listens to URL changes and tells React which components to render
Example: import { BrowserRouter } from "react-router-dom";

            root.render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
            );

Routes - Acts as a container for all your <Route/> definitions
Replaces <Switch> from older React Router versions and ensures only the best matching route renders
Example:<Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
        </Routes>

Route - Maps a URL path to a React component
Example: <Route path="/dashboard" element={<Dashboard />} />

Navigate - Programmatically redirects the user to another route

Example: <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
*/

import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import DashboardPage from "../pages/DashboardPage/DashboardPage";
import PlaylistDetailPage from "../pages/PlaylistDetailPage/PlaylistDetailPage";
import ProtectedRoute from "./ProtectedRoute";


/**
 * Defines all client-side routes for the application.
 *
 * - `/` redirects to `/dashboard`
 * - `/login` renders LoginPage (public)
 * - `/register` renders RegisterPage (public)
 * - `/dashboard` renders DashboardPage (protected)
 * - `/playlists/:id` renders PlaylistDetailPage (protected)
 * - `*` renders a 404 message for unknown paths
 *
 * Protected routes are wrapped in {@link ProtectedRoute}, which redirects
 * unauthenticated users to `/login`.
 *
 * @returns {JSX.Element} The fully configured router tree.
 */
function AppRouter() {
    return (
        //Routing Context with BrowserRouter
        <BrowserRouter>
            {/* Container for our routes  */}
            <Routes>

                {/* Default Route */}
                <Route path="/" element={<Navigate to ="/dashboard" replace/>}/>

                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>

                {/* App Routes */}
                <Route path="/dashboard" 
                    element={
                        <ProtectedRoute>
                            <DashboardPage/>
                        </ProtectedRoute>
                    }
                
                />

                <Route path="/playlists/:id"
                    element= {
                        <ProtectedRoute>
                            <PlaylistDetailPage/>
                        </ProtectedRoute>
                    }
                />

                {/* Catch-All */}
                <Route path="*" element={<h2>404 - Page not found</h2>}/>

            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
