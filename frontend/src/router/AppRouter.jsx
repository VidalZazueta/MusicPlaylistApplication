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
                <Route path="/dashboard" element={<DashboardPage/>}/>

                {/* Catch-All */}
                <Route path="*" element={<h2>404 - Page not found</h2>}/>

            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
