import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/AuthForm/AuthForm";

function LoginPage() {

  const navigate = useNavigate();

  const handleLogin = (formData) => {
    console.log("Login Submitted:", formData);

    navigate("/dashboard")
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Login</h1>
        <AuthForm mode="login" onSubmit={handleLogin}/>
    </div>
  );
}

export default LoginPage;
