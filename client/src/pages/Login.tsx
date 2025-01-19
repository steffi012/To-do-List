import React, { useState } from "react";
import "./Login.css";
import { UsePublicRequest } from "../hooks/useAPI";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, username } = useAuth();
  const { publicApiRequest } = UsePublicRequest();


  const handleLogin = async () => {
    setError(null); 
    setIsSubmitting(true); 

    try {
      const res = await publicApiRequest({
        cmd: "/auth",
        method: "GET", // Adjust method if required
        args: { email, password }, // Pass email and password
      });
      login(email, password);
      if (isAuthenticated) {
         console.log("login succes")
         
      } else {
        setError("Invalid response from server.");
      }
    } catch (err: any) {
      console.error("Error during login:", err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false); // Re-enable button
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login Page</h2>
        <div className="input-field">
          <label htmlFor="email">Username:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your username"
          />
        </div>
        <div className="input-field">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button onClick={handleLogin} disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default Login;
