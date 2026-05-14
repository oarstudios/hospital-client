// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import "./AdminLogin.css"

// const AdminLogin = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = () => {
//     if (email === "admin@ictc.com" && password === "123456") {
//       localStorage.setItem("adminToken", "true");
//       navigate("/ctrl");
//     } else {
//       alert("Invalid Credentials");
//     }
//   };

//   return (
//   <div className="admin-login-container">
//     <div className="admin-login-box">
//       <h2>Admin Login</h2>

//       <input
//         type="email"
//         placeholder="Email"
//         onChange={(e) => setEmail(e.target.value)}
//       />

//       <input
//         type="password"
//         placeholder="Password"
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       <button onClick={handleLogin}>Login</button>
//     </div>
//   </div>
// );
// };

// export default AdminLogin;

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/auth/authSlice";
import "./AdminLogin.css";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

 const handleLogin = async () => {
  if (!username || !password) {
    return alert("Please fill all fields");
  }

  await dispatch(
    loginUser({
      username,
      password,
    })
  );
};

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/ctrl");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2>Admin Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error-text">{error}</p>}

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;