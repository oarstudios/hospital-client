import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./MeetOurExperts.css";
import doctorData from "../../../data/doctorData";

const MeetOurExperts = () => {
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  const doctors = Object.values(doctorData);

  const scrollLeft = () => {
    sliderRef.current.scrollBy({ left: -350, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({ left: 350, behavior: "smooth" });
  };

  return (
    <section className="experts-section">
      {/* HEADER */}
      <div className="experts-header">
        <h2>Meet Our Experts</h2>

        <div className="nav-buttons">
          <button onClick={scrollLeft}>←</button>
          <button onClick={scrollRight}>→</button>
        </div>
      </div>

      {/* SLIDER */}
      <div className="experts-slider" ref={sliderRef}>
        {doctors.map((doc) => (
          <div className="doctor-card-home" key={doc.slug}>
            {/* IMAGE + HOVER */}
            <div className="doctor-img-wrapper">
              <img src={doc.image} alt={doc.name} />

              <div className="doctor-hover">
                <button
                  className="view-profile-btn"
                  onClick={() => navigate(`/doctor/${doc.slug}`)}
                >
                  View Complete Profile <span>→</span>
                </button>
              </div>
            </div>

            {/* CONTENT */}
            <div className="doctor-content">
              <h3>{doc.name}</h3>
              <p>{doc.qualification}</p>
            </div>

            {/* TAG */}
            <div className="doctor-tag">{doc.designation}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MeetOurExperts;
