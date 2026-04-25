import "./DoctorProfile.css";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import doctorData from "../../../data/doctorData";
import centerData from "../../../data/centerData";

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

  /* ================= EXISTING HARD CODED MAP LINKS ================= */
 const mapLinks = {
  vashi: "https://maps.app.goo.gl/q5mASiWVQ15ccWfv9",
  panvel: "https://maps.app.goo.gl/bzA4sg6f4V5WCqYC7",
  kalyan: "https://maps.app.goo.gl/py96ojscK7yXiBGdA",
  dombivli: "https://maps.app.goo.gl/WqLpBgyhgy8eRXzV8",
  dadar: "https://maps.app.goo.gl/quDbpjpiUJL4ML7P8",
  goregaon: "https://maps.app.goo.gl/A96PS1qUgGTyU8CF6",
  sion: "https://maps.app.goo.gl/ZzvMJTqN1rqAni9M9",
  ghatkopar: "https://maps.app.goo.gl/7a97hWyEuNbAkHXS6",
  chembur: "https://maps.app.goo.gl/Gz1JGVCbMyF2n1w48",
  santacruz: "https://maps.app.goo.gl/juHpkFo66RefWi76A",
  thane: "https://maps.app.goo.gl/BWT2qoniyASW1LXX8",
};

  /* ================= NEW: DOCTOR-WISE MAP LINKS ================= */
  const doctorMapLinks = {
    "salil-patkar": {
      vashi: "https://maps.app.goo.gl/q5mASiWVQ15ccWfv9",
      panvel: "https://maps.app.goo.gl/bzA4sg6f4V5WCqYC7",
    },
    "amit-ghanekar": {
      kalyan: "https://maps.app.goo.gl/py96ojscK7yXiBGdA",
      dombivli: "https://maps.app.goo.gl/WqLpBgyhgy8eRXzV8",
    },
    "viraj-nevrekar": {
      dadar: "https://maps.app.goo.gl/quDbpjpiUJL4ML7P8",
      goregaon: "https://maps.app.goo.gl/A96PS1qUgGTyU8CF6",
    },
    "rohit-pai": {
      sion: "https://maps.app.goo.gl/ZzvMJTqN1rqAni9M9",
    },
    "kunal-goyal": {
      vashi: "https://maps.app.goo.gl/bfwpWKKfr8SinZiJ9",
      sion: "https://maps.app.goo.gl/iv68CriEmrLLXRAN6",
      ghatkopar: "https://maps.app.goo.gl/7a97hWyEuNbAkHXS6",
    },
    "deep-vora": {
      ghatkopar: "https://maps.app.goo.gl/1mxCGYkEvpokkQvw7",
      chembur: "https://maps.app.goo.gl/Gz1JGVCbMyF2n1w48",
    },
    "shreya-gattani": {
      santacruz: "https://maps.app.goo.gl/juHpkFo66RefWi76A",
    },
    "darshan-jain": {
      thane: "https://maps.app.goo.gl/BWT2qoniyASW1LXX8",
    },
  };

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

            {/* CENTRES – UPDATED LOGIC */}
            <div className="info-row">
          

             <div className="centres-list">
  {doctor.centres.map((centre, index) => {
    const centreSlug = centreToSlug(centre);

    const finalLink =
      doctorMapLinks[slug]?.[centreSlug] ||
      mapLinks[centreSlug] ||
      "#";

    const centrePhone = centerData[centreSlug]?.phone;

    return (
      <div key={index} className="centre-row">
        
        {/* ICON FOR EACH LOCATION */}
        <img src={locationIcon} alt="location" />

        <div className="centre-content">
          {/* MAP LINK */}
          <a
            href={finalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="centre-map-link"
          >
            <strong>
              {doctor.name} – {centre}
            </strong>
          </a>

          {/* PHONE LINK */}
          <a
            href={`tel:${centrePhone?.replace(/\s+/g, "")}`}
            className="centre-phone-link"
          >
            Mob – {centrePhone}
          </a>
        </div>

      </div>
    );
  })}
</div>
            </div>

            <div className="info-row">
              <img src={phoneIcon} alt="phone" />
            <a
  href={`tel:${doctor.phone.replace(/\s+/g, "")}`}
  className="centre-phone-link"
>
  {doctor.phone}
</a>
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

            <div
              className={`summary-text ${
                showFullSummary ? "expanded" : ""
              }`}
            >
              {doctor.summary.split("\n\n").map((para, index) => (
                <p key={index}>{para}</p>
              ))}
            </div>

            {doctor.summary.length > 300 && (
              <button
                className="read-more-btn"
                onClick={() =>
                  setShowFullSummary(!showFullSummary)
                }
              >
                {showFullSummary ? "Read Less" : "Read More"}
              </button>
            )}
          </section>

          <section className="doctor-section doctor-details">
            <div className="details-block">
              <h3 className="details-title">Philosophy of Care</h3>
              <p className="details-text">{doctor.philosophy}</p>
            </div>

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

            <div className="details-block">
              <h3 className="details-title">
                Education & Training
              </h3>

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

            <div className="details-block">
              <h3 className="details-title">
                Professional Experience
              </h3>

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

            <div className="details-block">
              <h3 className="details-title">
                Achievements & Recognition
              </h3>

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

      <BookAppointment />
    </>
  );
};

export default DoctorProfile;