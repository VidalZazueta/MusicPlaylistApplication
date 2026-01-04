import { useState } from "react";

/**
 * @description Reusable authentication form for login and register
 * @param {string} mode - "login" | "register"
 * @param {Function} onSubmit - callback with form data
 */
function AuthForm({ mode = "login", onSubmit }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const isRegister = mode === "register";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError("All fields are required.");
      return;
    }

    if (isRegister && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    onSubmit({
      username,
      password
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
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
