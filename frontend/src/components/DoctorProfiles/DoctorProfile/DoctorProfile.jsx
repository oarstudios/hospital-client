import "./DoctorProfile.css";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import doctorData from "../../../data/doctorData";

/* ICONS */
import starIcon from "../../../assets/star.png";
import locationIcon from "../../../assets/location (2).png";
import phoneIcon from "../../../assets/phone.png";
import calendarIcon from "../../../assets/calendar.png";
import languageIcon from "../../../assets/language.png";
import userss from "../../../assets/Container.png";

import BookAppointment from "../../Home/BookAppointment/BookAppointment";

/* Helper: Convert centre name to URL slug */
const centreToSlug = (centre) =>
  centre
    .toLowerCase()
    .replace("ictc ", "")
    .replace(/\s+/g, "-");

const DoctorProfile = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const doctor = doctorData[slug];
  const [showFullSummary, setShowFullSummary] = useState(false);

  if (!doctor) return null;

  return (
    <>
      <section className="doctor-profile">
        {/* LEFT SIDEBAR */}
        <aside className="doctor-profile__sidebar">
          <div className="doctor-card">
            <div className="doctor-card__image">
              <img src={doctor.image} alt={doctor.name} />
            </div>

            <h2 className="doctor-card__name">{doctor.name}</h2>
            <p className="doctor-card__designation">{doctor.designation}</p>
            <p className="doctor-card__qualification">
             {doctor.qualification.split(",").map((item, index) => (
    <span key={index}>
      {item.trim()}
      <br />
    </span>
  ))}
            </p>

            <div className="doctor-card__rating">
              {[1, 2, 3, 4, 5].map((i) => (
                <img key={i} src={starIcon} alt="rating" />
              ))}
              <span>{doctor.rating}</span>
            </div>

            <p className="doctor-card__reviews">{doctor.reviews}</p>
          </div>

          {/* CONTACT INFORMATION */}
          <div className="doctor-info-card">
            <h3>Contact Information</h3>

            {/* CENTRES – CLICKABLE */}
            <div className="info-row">
              <img src={locationIcon} alt="location" />
              <div className="centres-list">
                {doctor.centres.map((centre, index) => (
                  <Link
                    key={index}
                    to={`/centre/${centreToSlug(centre)}`}
                    className="centre-link"
                  >
                    {centre}
                  </Link>
                ))}
              </div>
            </div>

            <div className="info-row">
              <img src={phoneIcon} alt="phone" />
              <span>{doctor.phone}</span>
            </div>

            <button
              className="info-row info-cta"
              onClick={() => navigate("/BookAppoinment")}
            >
              <img src={calendarIcon} alt="calendar" />
              Book an Appointment
            </button>
          </div>

          {/* LANGUAGES */}
          <div className="doctor-info-card">
            <h3>Languages Spoken</h3>
            {doctor.languages.map((lang) => (
              <div className="info-row" key={lang}>
                <img src={languageIcon} alt="lang" />
                <span>{lang}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* RIGHT CONTENT */}
        <main className="doctor-profile__content">
          <section className="doctor-section">
            <h2>Professional Summary</h2>

            <div className={`summary-text ${showFullSummary ? "expanded" : ""}`}>
              {doctor.summary.split("\n\n").map((para, index) => (
                <p key={index}>{para}</p>
              ))}
            </div>

            {doctor.summary.length > 300 && (
              <button
                className="read-more-btn"
                onClick={() => setShowFullSummary(!showFullSummary)}
              >
                {showFullSummary ? "Read Less" : "Read More"}
              </button>
            )}
          </section>

          <section className="doctor-section doctor-details">
            {/* PHILOSOPHY */}
            <div className="details-block">
              <h3 className="details-title">Philosophy of Care</h3>
              <p className="details-text">{doctor.philosophy}</p>
            </div>

            {/* EXPERTISE */}
            <div className="details-block">
              <h3 className="details-title">Expertise</h3>

              <div className="expertise-grid">
                <ul>
                  {doctor.expertise
                    .slice(0, Math.ceil(doctor.expertise.length / 2))
                    .map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                </ul>

                <ul>
                  {doctor.expertise
                    .slice(Math.ceil(doctor.expertise.length / 2))
                    .map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                </ul>
              </div>
            </div>

            {/* EDUCATION */}
            <div className="details-block">
              <h3 className="details-title">Education & Training</h3>
              <div className="timeline">
                {doctor.education.map((edu, i) => (
                  <div className="timeline-item" key={i}>
                    <span className="dot"></span>
                    <div>
                      <strong>{edu.title}</strong>
                      <p>{edu.place}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* EXPERIENCE */}
            <div className="details-block">
              <h3 className="details-title">Professional Experience</h3>
              <div className="timeline">
                {doctor.experience.map((exp, i) => (
                  <div className="timeline-item" key={i}>
                    <span className="dot"></span>
                    <div>
                      <strong>{exp.role}</strong>
                      <p>{exp.place}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ACHIEVEMENTS */}
            <div className="details-block">
              <h3 className="details-title">Achievements & Recognition</h3>
              <div className="achievement-grid">
                {doctor.achievements.map((ach, i) => (
                  <div className="achievement-card" key={i}>
                    <img src={userss} alt="icon" />
                    {ach}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </section>

      {/* BOOK APPOINTMENT SECTION */}
      <BookAppointment />
    </>
  );
};

export default DoctorProfile;
