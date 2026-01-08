import "./ExpertsAtICTC.css";
import { useParams, useNavigate } from "react-router-dom";
import doctorData from "../../../data/doctorData";

/* helper: slug → centre name */
const centreSlugToName = (slug) => {
  const map = {
    vashi: "ICTC Vashi",
    panvel: "ICTC Panvel",
    kalyan: "ICTC Kalyan",
    dombivli: "ICTC Dombivli",
    sion: "ICTC Sion",
    dadar: "ICTC Dadar",
    goregaon: "ICTC Goregaon",
    ghatkopar: "ICTC Ghatkopar",
    santacruz: "ICTC Santacruz",
    chembur: "ICTC Chembur",
  };

  return map[slug];
};

const ExpertsAtICTC = () => {
  const { slug } = useParams();          // ✅ centre slug from URL
  const navigate = useNavigate();

  const centreName = centreSlugToName(slug);

  // ✅ FILTER doctors ONLY for this centre
  const doctors = Object.values(doctorData).filter((doctor) =>
    doctor.centres.includes(centreName)
  );

  if (!centreName) return null;

  return (
    <section className="experts-section-dark">
      <h2 className="experts-heading">
        Experts at {centreName}
      </h2>

      {doctors.length === 0 ? (
        <p className="no-doctors">
          No doctors available at this centre.
        </p>
      ) : (
        doctors.map((doc, index) => (
          <div
            key={doc.slug}
            className={`expert-row ${index % 2 !== 0 ? "reverse" : ""}`}
          >
            {/* LEFT CARD */}
            <div className="expert-card">
              <div className="expert-img">
                <img src={doc.image} alt={doc.name} />
              </div>

              <h3>{doc.name}</h3>
              <p className="expert-short">{doc.qualification}</p>

              <div className="expert-tag">
                {doc.designation}
              </div>
            </div>

            {/* RIGHT CONTENT */}
            {/* RIGHT CONTENT */}
<div className="expert-content">
  <h3>{doc.name}</h3>

  <p className="expert-summary">
    {doc.summary}
  </p>

  <span
    className="know-more"
    onClick={() => navigate(`/doctor/${doc.slug}`)}
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

export default ExpertsAtICTC;
