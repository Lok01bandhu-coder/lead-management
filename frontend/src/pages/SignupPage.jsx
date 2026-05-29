import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUserPlus } from "react-icons/fi";
import { registerUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../utils/apiError";

function SignupPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isLoading) {
    return <div className="alert alert-secondary">Checking your session...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/leads" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Password and confirm password must match.");
      return;
    }

    try {
      setSubmitting(true);
      await registerUser({
        username: formData.username,
        password: formData.password,
      });
      navigate("/login", {
        replace: true,
        state: { message: "Account created successfully. Please login." },
      });
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, "Could not create your account."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-card card shadow-sm border-0">
        <div className="card-body p-4 p-md-5">
          <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
            <h2 className="h3 mb-0">Sign Up</h2>
            <Link
              to="/login"
              className="btn btn-outline-secondary btn-sm btn-icon-label"
              title="Back to login"
              aria-label="Back to login"
            >
              <FiArrowLeft className="btn-icon" />
              Login
            </Link>
          </div>

          {error ? <div className="alert alert-danger">{error}</div> : null}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                className="form-control"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose username"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                className="form-control"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Confirm Password</label>
              <input
                className="form-control"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
              />
            </div>

            <button
              className="btn btn-dark w-100 btn-icon-label"
              disabled={submitting}
              type="submit"
              title="Create a new user account"
              aria-label="Create a new user account"
            >
              <FiUserPlus className="btn-icon" />
              {submitting ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default SignupPage;
