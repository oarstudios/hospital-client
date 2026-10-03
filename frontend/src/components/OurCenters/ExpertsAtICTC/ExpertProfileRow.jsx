import "./ExpertsAtICTC.css";
import { useNavigate } from "react-router-dom";
import imgSrc from "../../Common/ImgSrc";
import { encryptId } from "../../Common/Idcrypto";
import { doctorAlt } from "../../../seo/pageSeo";

/**
 * Doctor profile row — photo card (name, qualifications, designation) beside
 * the doctor's summary and a "Know More" link to their profile.
 * Used on centre pages ("Experts at …") and as "About the Author" on blogs.
 */
const ExpertProfileRow = ({ doctor, reverse = false }) => {
  const navigate = useNavigate();
  if (!doctor) return null;

  return (
    <div className={`expert-row ${reverse ? "reverse" : ""}`}>
      {/* LEFT CARD */}
      <div className="expert-card">
        <div className="expert-img">
          <img src={imgSrc(doctor.image)} alt={doctorAlt(doctor)} />
        </div>

        <h3>{doctor.name}</h3>
        <p className="expert-short">
          {(doctor.qualification || "").split(",").map((item, i) => (
            <span key={i}>
              {item.trim()}
              <br />
            </span>
          ))}
        </p>

        {doctor.designation && <div className="expert-tag">{doctor.designation}</div>}
      </div>

      {/* RIGHT CONTENT */}
      <div className="expert-content">
        <h3>{doctor.name}</h3>

        {doctor.summary && <p className="expert-summary">{doctor.summary}</p>}

        <span
          className="know-more"
          role="link"
          tabIndex={0}
          onClick={() => navigate(`/doctor/${doctor.slug}/${encryptId(doctor.id)}`)}
          onKeyDown={(e) => {
            if (e.key === "Enter") navigate(`/doctor/${doctor.slug}/${encryptId(doctor.id)}`);
          }}
        >
          Know More <span>→</span>
        </span>
      </div>
    </div>
  );
};

export default ExpertProfileRow;
