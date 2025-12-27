import "../OurCenters/CenterBreadcrumb/CenterBreadcrumb.css";
import homeIcon from "../../assets/mdi-light_home.png";

const CancerDetBreadcrumb = ({ cancerName }) => {
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
          Cancers We Treat
        </span>

        <span className="center-breadcrumb__sep">›</span>

        <span className="center-breadcrumb__current">
          {cancerName}
        </span>
      </div>
    </nav>
  );
};

export default CancerDetBreadcrumb;
