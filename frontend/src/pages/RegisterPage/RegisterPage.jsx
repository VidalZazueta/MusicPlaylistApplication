import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/AuthForm/AuthForm";
import "./RegisterPage.css";

/**
 * Page component that renders the registration form.
 *
 * Currently logs the submitted form data and redirects to `/login` on submission.
 * Intended to be wired up to the register API endpoint.
 *
 * @returns {JSX.Element} The registration page UI.
 */
function RegisterPage() {

  const navigate = useNavigate();

  /**
   * Handles registration form submission.
   *
   * Logs the submitted credentials and redirects the user to the login page.
   *
   * @param {Object} formData - The form data submitted by the user.
   * @param {string} formData.username - The desired username.
   * @param {string} formData.password - The desired password.
   */
  const handleRegister = (formData) => {
    console.log("Register submitted:", formData);

    navigate("/login");
  };

  return (
    <div className="register-container">
      <AuthForm mode="register" onSubmit={handleRegister}/>
    </div>
  );
}

export default RegisterPage;
