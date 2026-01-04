import "./DoctorProfile.css";
import { useParams } from "react-router-dom";
import { useState } from "react";
import doctorData from "../../../data/doctorData";

/* ICONS */
import starIcon from "../../../assets/star.png";
import starIconEmpty from "../../../assets/startEmpty.png";
import locationIcon from "../../../assets/location (2).png";
import phoneIcon from "../../../assets/phone.png";
import calendarIcon from "../../../assets/calendar.png";
import languageIcon from "../../../assets/language.png";
import userss from "../../../assets/Container.png";
import BookAppointment from "../../Home/BookAppointment/BookAppointment";
// import tickIcon from "../../../assets/Vector (8).png";

const DoctorProfile = () => {
  const { slug } = useParams();
  const doctor = doctorData[slug];

  const [selectedCentre] = useState(
    doctor?.centres[0]
  );

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
          <p className="doctor-card__designation">
            {doctor.designation}
          </p>

          <p className="doctor-card__qualification">
            {doctor.qualification}
          </p>

          <div className="doctor-card__rating">
            {[1, 2, 3, 4].map((i) => (
              <img key={i} src={starIcon} alt="rating" />
            ))}
            <img src={starIconEmpty} alt="rating" />
            <span>{doctor.rating}</span>
          </div>

          <p className="doctor-card__reviews">{doctor.reviews}</p>
        </div>

        {/* CONTACT */}
        <div className="doctor-info-card">
          <h3>Contact Information</h3>

          <div className="info-row">
            <img src={locationIcon} alt="location" />
            <span>{selectedCentre}</span>
          </div>

          <div className="info-row">
            <img src={phoneIcon} alt="phone" />
            <span>{doctor.phone}</span>
          </div>

          <button className="info-row info-cta">
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
          <p>{doctor.summary}</p>
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
                {doctor.expertise.map((item, i) => (
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
                    <p>
                      {edu.place} – {edu.year}
                    </p>
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

          {/* BOOK APPOINTMENT */}
       {/* <div className="appointment-box">
      <h3 className="appointment-title">
        Book an Appointment with {doctor.name}
      </h3>

      <h6 className="appointment-subtitle">Patient Details</h6>

      <div className="appointment-form-grid">
        <input type="text" placeholder="Name" />
        <input type="number" placeholder="Age" />

        <input
          type="text"
          placeholder="Phone Number"
          className="full-width"
        />
      </div>

      <h6 className="appointment-subtitle">
        Select ICTC Centre for Appointment
      </h6>

      <div className="appointment-centre-row">
        {doctor.centres.map((centre) => (
          <div
            key={centre}
            className={`centre-checkbox ${
              selectedCentre === centre ? "active" : ""
            }`}
            onClick={() => setSelectedCentre(centre)}
          >
            <img src={tickIcon} alt="checked" />
            <span>{centre}</span>
          </div>
        ))}

        <input
          type="date"
          className="appointment-date"
          placeholder="Select appointment date"
        />
      </div>

      <button className="book-btn">Book Appointment</button>
    </div> */}



        </section>
      </main>
    </section>
<BookAppointment/>
    </>
  );
};

export default DoctorProfile;
