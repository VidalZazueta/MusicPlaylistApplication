import { Link } from "react-router-dom";

function RegisterPage() {
  return (
    <div style={{ padding: "1rem" }}>
      <h1>Register</h1>
      <p>This page will use the shared AuthForm later.</p>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
