import { useState } from "react";
import "./AuthForm.css";

/**
 * Reusable authentication form that supports both login and register modes.
 *
 * In `"register"` mode, a Confirm Password field is shown and passwords are
 * validated to match before the form data is emitted upward.
 *
 * @param {Object} props
 * @param {"login"|"register"} [props.mode="login"] - Controls which fields and labels are displayed.
 * @param {function({username: string, password: string}): void} props.onSubmit - Callback invoked with the validated form data.
 * @returns {JSX.Element} The rendered authentication form.
 */
function AuthForm({ mode = "login", onSubmit }) {

    //Controlled states
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);

    //Determine if we are in login or register UI
    const isRegister = mode === "register";

    /**
     * Handles form submission. Validates required fields and, in register mode,
     * checks that passwords match. Calls `onSubmit` with `{ username, password }`.
     *
     * @param {React.FormEvent<HTMLFormElement>} e - The form submit event.
     */
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
        <form onSubmit={handleSubmit} className="auth-form">

        {/* Dynamic title based on mode */}
        <h2>{isRegister ? "Register" : "Login"}</h2>

        {error && <p className="auth-form-error">{error}</p>}

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
