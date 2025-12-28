import { Link } from "react-router-dom";

function LoginPage() {
  return (
    <div style={{ padding: "1rem" }}>
      <h1>Login</h1>
      <p>This page will use the shared AuthForm later.</p>
      <p>
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default LoginPage;
