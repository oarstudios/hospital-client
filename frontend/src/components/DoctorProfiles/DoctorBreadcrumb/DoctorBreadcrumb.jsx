import "../../OurCenters/CenterBreadcrumb/CenterBreadcrumb.css";
import homeIcon from "../../../assets/mdi-light_home.png";

const DoctorBreadcrumb = ({ docName }) => {
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
          Doctors at ICTC
        </span>

        <span className="center-breadcrumb__sep">›</span>

        <span className="center-breadcrumb__current">
          {docName}
        </span>
      </div>
    </nav>
  );
};

export default DoctorBreadcrumb;
