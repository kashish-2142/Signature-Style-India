// Signup page component
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");

  const { signup, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear any existing errors when user starts typing
    if (error) clearError();
    if (validationError) setValidationError("");
  };

  // Validate form data
  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 6) {
      setValidationError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const result = await signup(
      formData.name,
      formData.email,
      formData.password
    );

    if (result.success) {
      // Redirect to home page after successful signup
      navigate("/");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <div className="form-container signup-form-container">
        <h1>Join Signature Style India</h1>

        {/* Display error messages */}
        {(error || validationError) && (
          <div className="error-message">{error || validationError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group signup-form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group signup-form-group">
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

          <div className="form-group signup-form-group">
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
            <small style={{ color: "#7f8c8d", fontSize: "0.8rem" }}>
              Password must be at least 6 characters long
            </small>
          </div>

          <div className="form-group signup-form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn btn-signup"
            style={{ width: "100%", marginBottom: "1rem" }}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Link to login page */}
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <p>
            Already have an account?{" "}
            <Link to="/login" className="login-link">
              Login here
            </Link>
          </p>
        </div>

        {/* Terms and conditions note */}
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            backgroundColor: "#ecf0f1",
            borderRadius: "4px",
            fontSize: "0.9rem",
            textAlign: "center",
          }}
        >
          <p>
            By signing up, you agree to our terms and conditions and privacy
            policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
