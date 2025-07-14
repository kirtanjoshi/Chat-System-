import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      return setError("Passwords don't match");
    }

    try {
      await fetch.post("http://localhost:3000/auth/reset-password", {
        token,
        password,
      });

      alert("Password updated successfully!");
      navigate("/login");
    } catch (err) {
      setError("Invalid or expired token");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Reset Your Password</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <br />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <br />
      <br />
      <button onClick={handleSubmit}>Reset Password</button>
    </div>
  );
};

export default ResetPassword;
