// import { useNavigate } from "react-router-dom";
// import "./AdminNavbar.css";

// const AdminNavbar = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("adminToken");
//     navigate("/ctrl/login");
//   };

//   return (
//     <div className="admin-navbar">
//       <div className="admin-navbar-left">
//         <h3>ICTC Admin Panel</h3>
//       </div>

//       <div className="admin-navbar-right">
//         <span className="admin-user">Admin</span>
//         <button onClick={handleLogout}>Logout</button>
//       </div>
//     </div>
//   );
// };

// export default AdminNavbar;





import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import "./AdminNavbar.css";
import { logoutUserAsync } from "../redux/auth/authSlice";

const AdminNavbar = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {

    await dispatch(logoutUserAsync());

    navigate("/ctrl/login");
  };

  return (
    <div className="admin-navbar">
      <div className="admin-navbar-left">
        <h3>ICTC Admin Panel</h3>
      </div>

      <div className="admin-navbar-right">
        <span className="admin-user">
          Admin
        </span>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;