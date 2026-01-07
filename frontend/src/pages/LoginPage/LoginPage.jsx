import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../../services/authService";
import AuthForm from "../../components/AuthForm/AuthForm";

function LoginPage() {

  const navigate = useNavigate();
  const [error, setError] = useState(null);

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
    <div style={{ padding: "1rem" }}>

      {error && <p style = {{ color: "red" }}>{error}</p>}

        <AuthForm mode="login" onSubmit={handleLogin}/>
    </div>
  );
}

export default LoginPage;
