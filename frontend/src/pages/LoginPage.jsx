import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { FiLogIn, FiUserPlus } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/leads";
  const successMessage = location.state?.message;

  if (isLoading) {
    return <div className="alert alert-secondary">Checking your session...</div>;
  }

  if (!isLoading && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await login(formData);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-card card shadow-sm border-0">
        <div className="card-body p-4 p-md-5">
          <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
            <h2 className="h3 mb-0">Login</h2>
            <Link
              to="/signup"
              className="btn btn-outline-secondary btn-sm btn-icon-label"
              title="Create a new user account"
              aria-label="Create a new user account"
            >
              <FiUserPlus className="btn-icon" />
              Sign Up
            </Link>
          </div>
       
          {successMessage ? <div className="alert alert-success">{successMessage}</div> : null}
          {error ? <div className="alert alert-danger">{error}</div> : null}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                className="form-control"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                className="form-control"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            </div>

            <button
              className="btn btn-dark w-100 btn-icon-label"
              disabled={submitting}
              type="submit"
              title="Sign in to your account"
              aria-label="Sign in to your account"
            >
              <FiLogIn className="btn-icon" />
              {submitting ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
