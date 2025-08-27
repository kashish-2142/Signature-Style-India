// Login page component
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page user was trying to access before login
  const from = location.state?.from?.pathname || "/";

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear any existing errors when user starts typing
    if (error) clearError();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Redirect to the page user was trying to access, or home
      navigate(from, { replace: true });
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            color: "#2c3e50",
          }}
        >
          Login to DenimStore
        </h2>

        {/* Display error message if any */}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginBottom: "1rem" }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Link to signup page */}
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <p>
            Don't have an account?{" "}
            <Link
              to="/signup"
              style={{ color: "#3498db", textDecoration: "none" }}
            >
              Sign up here
            </Link>
          </p>
        </div>

        {/* Demo credentials info */}
        </div>
    </div>
  );
};

export default Login;
