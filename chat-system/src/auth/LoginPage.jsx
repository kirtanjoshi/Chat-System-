  import React, { use, useEffect, useState } from "react";
  import "./LoginPage.css"; // Ensure this CSS file exists and is styled for SignUp
import { Link, useNavigate } from "react-router-dom";
  
import {signInWithGoogle} from "./Firebase"

const Loginpage = () => {
  const navigate = useNavigate();
    const [formData, setFormData] = useState({
      email: "",
      password: "",
    });
    const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    localStorage.removeItem("jwt");
  })

    // Handle input changes
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
  };
  // In your Login page
const handleGoogleLogin = async () => {
  try {
    const firebaseIdToken = await signInWithGoogle();

    const res = await fetch("http://localhost:3002/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idToken: firebaseIdToken,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to authenticate with backend");
    }

    const data = await res.json();
    console.log("Google login successful:", data);
    navigate("/chat");
    // After Google login success
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    console.log("JWT Token:", data);
  } catch (err) {
    console.error("Google login failed:", err);
  }
};


    // Register user function
    const loginUser = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:3002/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        // if (!response.ok) throw new Error(data.message || "Login failed");
        console.log(data)

        const { token, user } = data  ;
        console.log(token)
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        console.log("Token:", token)
        console.log("User:", user)
        if (response.ok) {
          alert("Login successful.");
          navigate("/chat");
        
        } else {
          const errorData = await response.json();
          setErrors({ general: errorData.message || "Login failed." });
        }
        
      } catch (error) {
        setErrors({ general: "An error occurred. Please try again." });
      } finally {
        setIsLoading(false);
      }
    };

    // Validate form
    const validateForm = () => {
      const newErrors = {};

      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      return newErrors;
    };

    // Handle form submission
    const handleSubmit = (e) => {
      e.preventDefault();
      loginUser();
    };

    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Please sign in to login your account</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "error" : ""}
                placeholder="Enter your email"
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "error" : ""}
                placeholder="Enter your password"
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? "Signing up..." : "Login"}
            </button>
            {errors.general && (
              <span className="error-message">{errors.general}</span>
            )}
          </form>

          <div className="p-5 m-8    bg-red-800" onClick={
            handleGoogleLogin
          } style={{ cursor: "pointer", color: "white", textAlign: "center" }
          }>
            Login with Google
          </div>

          <div className="login-footer">
            <p>
              Already have an account?{" "}
              <Link to="/signUp" className="signup-link">
                SignUp
              </Link>
            </p>
            <button
              type="button"
              className="forgot-link"
              onClick={() => navigate("/forgot-password")}
              style={{
                background: "none",
                border: "none",
                color: "#007bff",
                cursor: "pointer",
                padding: 0,
                marginTop: "10px",
              }}
            >
              Forgot Password?
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default Loginpage;
