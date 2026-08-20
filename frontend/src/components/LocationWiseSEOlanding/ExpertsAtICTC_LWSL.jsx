import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "../../redux/doctors/doctorsSlice";
import imgSrc from "../Common/ImgSrc";
import { encryptId } from "../Common/Idcrypto";
import { doctorAlt } from "../../seo/pageSeo";
import useLandingCenter from "./useLandingCenter";
import "./ExpertsAtICTC_LWSL.css";

const doctorBelongsToCentre = (doctor, centerId) => {
  if (!centerId) return false;
  if (Array.isArray(doctor.centreIds) && doctor.centreIds.includes(centerId)) return true;
  if (Array.isArray(doctor.centres) && doctor.centres.some((c) => c.centreId === centerId)) {
    return true;
  }
  return false;
};

const ExpertsAtICTC_LWSL = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { center } = useLandingCenter();
  const { list: doctors = [] } = useSelector((s) => s.doctors || {});

  useEffect(() => {
    if (!doctors.length) dispatch(fetchDoctors());
  }, [dispatch, doctors.length]);

  if (!center) return null;

  const centreDoctors = doctors.filter((doc) => doctorBelongsToCentre(doc, center.id));

  return (
    <section className="experts-section-dark">
      <h2 className="experts-heading">Experts at {center.name}</h2>

      {centreDoctors.length === 0 ? (
        <p className="no-doctors">No doctors available at this centre.</p>
      ) : (
        centreDoctors.map((doc, index) => (
          <div
            key={doc.id || doc.slug}
            className={`expert-row ${index % 2 !== 0 ? "reverse" : ""}`}
          >
            <div className="expert-card">
              <div className="expert-img">
                <img src={imgSrc(doc.image)} alt={doctorAlt(doc)} />
              </div>
              <h3>{doc.name}</h3>
              <p className="expert-short">
                {(doc.qualification || "").split(",").map((item, idx) => (
                  <span key={idx}>
                    {item.trim()}
                    <br />
                  </span>
                ))}
              </p>
              <div className="expert-tag">{doc.designation}</div>
            </div>

            <div className="expert-content">
              <h3>{doc.name}</h3>
              <p className="expert-summary">{doc.summary}</p>
              <span
                className="know-more"
                onClick={() => navigate(`/doctor/${doc.slug}/${encryptId(doc.id)}`)}
              >
                Know More <span>→</span>
              </span>
            </div>
          </div>
        ))
      )}
    </section>
  );
};

export default ExpertsAtICTC_LWSL;
