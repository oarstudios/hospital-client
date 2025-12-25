import "./CenterBreadcrumb.css";
import homeIcon from "../../../assets/mdi-light_home.png";

const CenterBreadcrumb = ({ centerName }) => {
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
          Our Centres
        </span>

        <span className="center-breadcrumb__sep">›</span>

        <span className="center-breadcrumb__current">
          {centerName}
        </span>
      </div>
    </nav>
  );
};

export default CenterBreadcrumb;
