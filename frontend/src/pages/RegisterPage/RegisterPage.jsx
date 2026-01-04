import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/AuthForm/AuthForm";

function RegisterPage() {

  const navigate = useNavigate();

  const handleRegister = (formData) => {
    console.log("Register submitted:", formData);

    navigate("/login");
  };

  return (
    <div style={{ padding: "1rem" }}>
      <AuthForm mode="register" onSubmit={handleRegister}/>
    </div>
  );
}

export default RegisterPage;
