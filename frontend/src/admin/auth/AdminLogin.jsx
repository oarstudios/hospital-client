import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, fetchCurrentUser } from "../../redux/auth/authSlice";
import FieldError from "../../components/Common/FieldError";
import { notifyFirstError, clearField } from "../../components/Common/formFeedback";
import "./AdminLogin.css";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleLogin = async () => {
    const nextErrors = {};
    if (!username.trim()) nextErrors.username = "Username is required.";
    if (!password) nextErrors.password = "Password is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      notifyFirstError(dispatch, nextErrors);
      return;
    }

    const result = await dispatch(loginUser({ username, password }));

    // After a successful login the cookie is set — fetch the user object
    // so state.auth.user is populated before the redirect
    if (loginUser.fulfilled.match(result)) {
      await dispatch(fetchCurrentUser());
    }
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
          className={errors.username ? "input-invalid" : ""}
          placeholder="Username"
          value={username}
          onChange={(e) => {
            clearField(setErrors, "username");
            setUsername(e.target.value);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        <FieldError message={errors.username} />

        <input
          type="password"
          className={errors.password ? "input-invalid" : ""}
          placeholder="Password"
          value={password}
          onChange={(e) => {
            clearField(setErrors, "password");
            setPassword(e.target.value);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        <FieldError message={errors.password} />

        {error && <p className="error-text">{error}</p>}

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
