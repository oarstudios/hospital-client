import "../OurCenters/CenterBreadcrumb/CenterBreadcrumb.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import homeIcon from "../../assets/mdi-light_home.png";

const BlogPostBreadcrumb = () => {
  const navigate = useNavigate();
  const blog = useSelector((state) => state.blogs?.selected);

  if (!blog) return null;

  const parentPath = "/blog";
  const parentLabel = "Blogs";

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

        <span
          className="center-breadcrumb__text"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(parentPath)}
        >
          {parentLabel}
        </span>

        <span className="center-breadcrumb__sep">›</span>

        <span className="center-breadcrumb__current">{blog.title}</span>
      </div>
    </nav>
  );
};

export default BlogPostBreadcrumb;
