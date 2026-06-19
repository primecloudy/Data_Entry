import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";
import bg from "../assets/bg.png";

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    const { username, password } = credentials;

    if (!username || !password) {
      alert("⚠️ Please enter username and password");
      return;
    }

    
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
        alert(`✅ Welcome, ${data.user.username}!`);

        // ✅ Redirect logic changed
        if (data.user.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/home"); // 👈 changed from "/attendance" → "/home"
        }
      } else {
        alert(data.error || "❌ Invalid username or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("⚠️ Failed to connect to server");
    }
  };

  return (
    <div
      className="login-wrapper"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <form onSubmit={handleLogin} className="glass-card">
        {/* Company Logo & Name */}
        <div className="company-header">
          <h2 className="company-name">VLTS Control Room Employee Login</h2>
        </div>

        <input
          type="text"
          className="glass-input"
          placeholder="Username"
          value={credentials.username}
          onChange={(e) =>
            setCredentials({ ...credentials, username: e.target.value })
          }
        />
        <input
          type="password"
          className="glass-input"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
        />
        <button type="submit" className="glass-btn">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
