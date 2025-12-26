import "../OurCenters/CenterBreadcrumb/CenterBreadcrumb.css";
import homeIcon from "../../assets/mdi-light_home.png";

const BlogPostBreadcrumb = ({ blogPostName }) => {
  return (
    <nav className="center-breadcrumb">
      <div className="center-breadcrumb__content">
        <img
          src={homeIcon}
          alt="home"
          className="center-breadcrumb__home"
        />

        <span className="center-breadcrumb__sep">›</span>

        <span className="center-breadcrumb__text">
          Blogs and News
        </span>

        <span className="center-breadcrumb__sep">›</span>

        <span className="center-breadcrumb__current">
          {blogPostName}
        </span>
      </div>
    </nav>
  );
};

export default BlogPostBreadcrumb;
