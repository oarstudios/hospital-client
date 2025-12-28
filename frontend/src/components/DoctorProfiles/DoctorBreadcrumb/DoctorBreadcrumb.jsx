import "../../OurCenters/CenterBreadcrumb/CenterBreadcrumb.css";
import homeIcon from "../../../assets/mdi-light_home.png";
import { useNavigate, useParams } from "react-router-dom";
import doctorData from "../../../data/doctorData";

const DoctorBreadcrumb = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const doctor = doctorData[slug];
  const doctorName = doctor?.name || "Doctor Profile";

  return (
    <nav className="center-breadcrumb">
      <div className="center-breadcrumb__content">
        {/* HOME */}
        <img
          src={homeIcon}
          alt="home"
          className="center-breadcrumb__home"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        />

        <span className="center-breadcrumb__sep">›</span>

        {/* DOCTORS LIST */}
        <span
          className="center-breadcrumb__text"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/ourDoctors")}
        >
          Doctors at ICTC
        </span>

        <span className="center-breadcrumb__sep">›</span>

        {/* CURRENT DOCTOR */}
        <span className="center-breadcrumb__current">
          {doctorName}
        </span>
      </div>
    </nav>
  );
};

export default DoctorBreadcrumb;
