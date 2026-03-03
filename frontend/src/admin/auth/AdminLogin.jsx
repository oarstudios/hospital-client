import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./AdminLogin.css"

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email === "admin@ictc.com" && password === "123456") {
      localStorage.setItem("adminToken", "true");
      navigate("/ctrl");
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
  <div className="admin-login-container">
    <div className="admin-login-box">
      <h2>Admin Login</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  </div>
);
};

export default AdminLogin;