import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { login } from "../../services/authService";
import AuthForm from "../../components/AuthForm/AuthForm";
import "./LoginPage.css";

/**
 * Page component that renders the login form and handles authentication.
 *
 * Displays an error message if login fails, and redirects the user to
 * the dashboard on successful login.
 *
 * @returns {JSX.Element} The login page UI.
 */
function LoginPage() {

  const navigate = useNavigate();
  const [error, setError] = useState(null);

  /**
   * Handles login form submission by calling the auth service.
   *
   * On success, stores the JWT access token in localStorage and navigates
   * to the dashboard. On failure, sets the error state with the error message.
   *
   * @async
   * @param {Object} formData - The form data submitted by the user.
   * @param {string} formData.username - The user's username.
   * @param {string} formData.password - The user's password.
   * @returns {Promise<void>}
   */
  const handleLogin =  async (formData) => {

    try {
      setError(null);

      //Backend call
      const result = await login(formData);

      //Save token locally
      localStorage.setItem("token", result.access_token);

      //Go to dashboard
      navigate("/dashboard");

    } catch(error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <AuthForm mode="login" onSubmit={handleLogin}/>
        {error && <p className="login-error">{error}</p>}
        <div className="register-box">
          <Link  to="/register" className="register-text">
            Don't have an account? Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
