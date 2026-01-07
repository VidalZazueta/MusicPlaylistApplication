import { useState } from "react";

/**
 * @description Reusable authentication form for login and register
 * @param {string} mode - "login" | "register"
 * @param {Function} onSubmit - callback with form data
 */
function AuthForm({ mode = "login", onSubmit }) {

    //Controlled states
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);

    //Determine if we are in login or register UI
    const isRegister = mode === "register";

    //Handle form submission
    const handleSubmit = (e) => {
        //Prevent browers reload
        e.preventDefault();
        setError(null);

        //* Required fields
        if (!username || !password) {
        setError("All fields are required.");
        return;
        }

        //Validate the registration details
        if (isRegister && password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
        }

        //Emit data upward
        onSubmit({
        username,
        password
        });
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>

        {/* Dynamic title based on mode */}
        <h2>{isRegister ? "Register" : "Login"}</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div>
            <label>Username</label>
            <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />
        </div>

        <div>
            <label>Password</label>
            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
        </div>

        {/* Confirm password (register only) */}
        {isRegister && (
            <div>
            <label>Confirm Password</label>
            <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            </div>
        )}

        <button type="submit">
            {isRegister ? "Create Account" : "Login"}
        </button>
        </form>
  );
}

export default AuthForm;
