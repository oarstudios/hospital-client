import { NavLink } from "react-router-dom";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      <h2>ICTC Admin</h2>

      <NavLink to="/ctrl" end>
        Dashboard
      </NavLink>

      <NavLink to="/ctrl/centers">
        Centers
      </NavLink>

      <NavLink to="/ctrl/doctors">
        Doctors
      </NavLink>

      <NavLink to="/ctrl/blogs">
        Blogs
      </NavLink>

      <NavLink to="/ctrl/cancers">
        Cancers
      </NavLink>

      <NavLink to="/ctrl/services">
        Services
      </NavLink>

      <NavLink to="/ctrl/testimonials">
        Testimonials
      </NavLink>

      <NavLink to="/ctrl/appointments">
        Appointments
      </NavLink>
    </div>
  );
};

export default AdminSidebar;