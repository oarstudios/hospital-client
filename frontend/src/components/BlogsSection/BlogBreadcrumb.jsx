import "../OurCenters/CenterBreadcrumb/CenterBreadcrumb.css";
import homeIcon from "../../assets/mdi-light_home.png";

const BlogBreadcrumb = ({ blogNewsName }) => {
  return (
    <nav className="center-breadcrumb">
      <div className="center-breadcrumb__content">
        <img
          src={homeIcon}
          alt="home"
          className="center-breadcrumb__home"
        />

        <span className="center-breadcrumb__sep">›</span>

      

   

        <span className="center-breadcrumb__current">
          {blogNewsName}
        </span>
      </div>
    </nav>
  );
};

export default BlogBreadcrumb;
