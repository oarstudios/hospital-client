// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//   const isAdmin = localStorage.getItem("adminToken");

//   if (!isAdmin) {
//     return <Navigate to="/ctrl/login" />;
//   }

//   return children;
// };

// export default ProtectedRoute;


import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {

  const {
    isAuthenticated,
    loading,
  } = useSelector((state) => state.auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/ctrl/login" replace />;
  }

  return children;
};

export default ProtectedRoute;