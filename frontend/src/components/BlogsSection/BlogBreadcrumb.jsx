import "../OurCenters/CenterBreadcrumb/CenterBreadcrumb.css";
import { useNavigate } from "react-router-dom";
import homeIcon from "../../assets/mdi-light_home.png";

const BlogBreadcrumb = ({ label = "Blogs" }) => {
  const navigate = useNavigate();

  return (
    <nav className="center-breadcrumb">
      <div className="center-breadcrumb__content">
        <img
          src={homeIcon}
          alt="home"
          className="center-breadcrumb__home"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        />

        <span className="center-breadcrumb__sep">›</span>

        <span className="center-breadcrumb__current">
          {label}
        </span>
      </div>
    </nav>
  );
};

export default BlogBreadcrumb;
