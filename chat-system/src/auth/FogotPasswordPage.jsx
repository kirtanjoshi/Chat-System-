import React, { useState } from "react";
import "./ForgetPassword.css";

const ForgotPasswordPage = () => {
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState("");
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();

    // Reset previous messages and errors
    setForgotMsg("");
    setErrors({});

    // Validate email first (before API call)
    if (!forgotEmail) {
      setErrors({ email: "Email is required" });
      return;
    }

    if (!validateEmail(forgotEmail)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    setForgotLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3002/auth/forget-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: forgotEmail }),
        }
      );

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        setErrors({ email: data.message || "An error occurred" });
        setForgotLoading(false);
        return;
      }

      // Success case
      setForgotMsg("Password reset link has been sent to your email address.");
      setForgotEmail("");
    } catch (error) {
      console.error("Network error:", error);
      setErrors({ email: "Network error. Please try again." });
    } finally {
      setForgotLoading(false);
    }
  };

  const handleBackToLogin = () => {
    // You can implement navigation logic here
    alert("Navigate back to login page");
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <div className="forgot-header">
          <h2>Forgot Password?</h2>
          <p>
            Enter your email address and we'll send you a link to reset your
            password
          </p>
        </div>

        <form className="forgot-form" onSubmit={handleForgotSubmit}>
          <div className="form-group">
            <label htmlFor="forgot-email">Email Address</label>
            <input
              type="email"
              id="forgot-email"
              value={forgotEmail}
              onChange={(e) => {
                setForgotEmail(e.target.value);
                if (errors.email) {
                  setErrors({ ...errors, email: "" });
                }
              }}
              className={errors.email ? "error" : ""}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <button
            type="submit"
            className="reset-button"
            disabled={forgotLoading}
          >
            {forgotLoading ? "Sending..." : "Send Reset Link"}
          </button>

          {forgotMsg && <div className="success-message">{forgotMsg}</div>}
        </form>

        <div className="forgot-footer">
          <button className="back-button" onClick={handleBackToLogin}>
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
