import "./DoctorProfile.css";
import { useState } from "react";

/* IMAGES (you will replace these) */
import doctorImg from "../../../assets/doctor.png";
import starIcon from "../../../assets/star.png";
import starIconEmpty from "../../../assets/startEmpty.png";
import locationIcon from "../../../assets/location (2).png";
import phoneIcon from "../../../assets/phone.png";
import calendarIcon from "../../../assets/calendar.png";
import languageIcon from "../../../assets/language.png";
import userss from "../../../assets/Container.png";
import tickIcon from "../../../assets/Vector (8).png";

const DoctorProfile = () => {
      const [selectedCentre, setSelectedCentre] = useState("ICTC Sion");
  return (
    <section className="doctor-profile">

      {/* LEFT SIDEBAR */}
      <aside className="doctor-profile__sidebar">

        {/* DOCTOR CARD */}
        <div className="doctor-card">
          <div className="doctor-card__image">
            <img src={doctorImg} alt="Doctor" />
          </div>

          <h2 className="doctor-card__name">Dr. Rohit Pai</h2>
          <p className="doctor-card__designation">
            Medico Oncologist & Hemato Oncologist
          </p>

          <p className="doctor-card__qualification">
            MD Medicine (AIIMS), DM Medical Oncology (AIIMS),
            MRCP (UK), DNB, ECMO
          </p>

          <div className="doctor-card__rating">
            <img src={starIcon} alt="rating" />
                 <img src={starIcon} alt="rating" />
                      <img src={starIcon} alt="rating" />
                           <img src={starIcon} alt="rating" />
                            <img src={starIconEmpty} alt="rating" />
            <span>4.9</span>
          </div>

          <p className="doctor-card__reviews">50+ Ratings</p>
        </div>

        {/* CONTACT INFO */}
        <div className="doctor-info-card">
          <h3>Contact Information</h3>

          <div className="info-row">
            <img src={locationIcon} alt="location" />
            <span>ICTC, Sion</span>
          </div>

          <div className="info-row">
            <img src={phoneIcon} alt="phone" />
            <span>+91-9820007628</span>
          </div>

          <button className="info-row info-cta">
            <img src={calendarIcon} alt="calendar" />
            Book an Appointment
          </button>
        </div>

        {/* LANGUAGES */}
        <div className="doctor-info-card">
          <h3>Languages Spoken</h3>

          <div className="info-row">
            <img src={languageIcon} alt="lang" />
            <span>English</span>
          </div>

          <div className="info-row">
            <img src={languageIcon} alt="lang" />
            <span>Hindi</span>
          </div>
        </div>
      </aside>

      {/* RIGHT CONTENT */}
      <main className="doctor-profile__content">

        {/* PROFESSIONAL SUMMARY */}
        <section className="doctor-section">
          <h2>Professional Summary</h2>
          <p>
            Dr. Rohit Pai is an experienced Consultant Medical Oncologist known for his expertise in managing both solid tumors and blood cancers. With vast experience at Bombay Hospital and as an Honorary Visiting Consultant at Nair Charitable Hospital, he delivers comprehensive and compassionate cancer care.

He holds an MBBS, MD in Internal Medicine, and DM in Medical Oncology from AIIMS, along with DNB and MRCP (UK) qualifications. Additionally, Dr. Pai is certified by the European Society of Medical Oncology (ESMO), ensuring his knowledge aligns with global oncology standards.
An academic achiever, Dr. Pai secured All India Rank 1 in the AIIMS Post Graduate Entrance Examination, a remarkable testament to his dedication and excellence in medical oncology.
His clinical expertise covers gastrointestinal, breast, head and neck, and hematological cancers, offering evidence-based and individualized care. Furthermore, he specializes in chemotherapy, immunotherapy, and targeted therapy, utilizing the latest advances to enhance treatment outcomes.

Dr. Rohit Pai is highly regarded for his patient-centered approach, combining scientific precision with empathy. His goal is to ensure every patient receives personalized, effective, and advanced cancer treatment built on trust and innovation.
          </p>
        </section>

        {/* COMBINED DETAILS CONTAINER */}
<section className="doctor-section doctor-details">

  {/* PHILOSOPHY */}
  <div className="details-block">
    <h3 className="details-title">Philosophy of Care</h3>
    <p className="details-text">
      My approach to patient care is centered on three core principles:
      empathy, evidence-based medicine, and collaboration. I strive to
      understand not just the clinical aspects of a condition but also its
      impact on the patient's life. By combining the latest scientific
      research with a personalized treatment plan, I work with my patients
      to achieve the best possible outcomes while respecting their values
      and preferences.
    </p>
  </div>

  {/* EXPERTISE */}
  <div className="details-block">
    <h3 className="details-title">Expertise</h3>

    <div className="expertise-grid">
      <ul>
        <li>Immunotherapy</li>
        <li>Molecular targeted therapy</li>
      </ul>

      <ul>
        <li>Immunotherapy</li>
        <li>Molecular targeted therapy</li>
      </ul>
    </div>
  </div>

  {/* EDUCATION */}
  <div className="details-block">
    <h3 className="details-title">Education & Training</h3>

    <div className="timeline">
      <div className="timeline-item">
        <span className="dot"></span>
        <div>
          <strong>Fellowship, Hematology & Oncology</strong>
          <p>Metropolis General Hospital, 2012–2015</p>
        </div>
      </div>

      <div className="timeline-item">
        <span className="dot"></span>
        <div>
          <strong>Residency, Internal Medicine</strong>
          <p>University of Midtown Medical Center, 2009–2012</p>
        </div>
      </div>

      <div className="timeline-item">
        <span className="dot"></span>
        <div>
          <strong>MD, PhD in Molecular Biology</strong>
          <p>Prestige School of Medicine, 2009</p>
        </div>
      </div>
    </div>
  </div>

  {/* EXPERIENCE */}
  <div className="details-block">
    <h3 className="details-title">Professional Experience</h3>

    <div className="timeline">
      <div className="timeline-item">
        <span className="dot"></span>
        <div>
          <strong>Consultant Medical Oncologist</strong>
          <p>Bombay Hospital</p>
        </div>
      </div>

      <div className="timeline-item">
        <span className="dot"></span>
        <div>
          <strong>Honorary Visiting Consultant</strong>
          <p>University of Midtown, 2015–2017</p>
        </div>
      </div>
    </div>
  </div>

  {/* ACHIEVEMENTS */}
  <div className="details-block">
    <h3 className="details-title">Achievements & Recognition</h3>

    <div className="achievement-grid">
      <div className="achievement-card">
        <img src={userss} alt="icon" />
        Member of the Royal College of Physicians (UK)
      </div>

      <div className="achievement-card">
        <img src={userss} alt="icon" />
        Member of the European Society of Medical Oncology (ESMO)
      </div>
    </div>
  </div>

  {/* BOOK APPOINTMENT */}
 <div className="appointment-box">
  <h3 className="appointment-title">
    Book an Appointment with Dr. Rohit Pai
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
        <div
          className={`centre-checkbox ${
            selectedCentre === "ICTC Sion" ? "active" : ""
          }`}
          onClick={() => setSelectedCentre("ICTC Sion")}
        >
          <img src={tickIcon} alt="checked" />
          <span>ICTC Sion</span>
        </div>

        <div
          className={`centre-checkbox ${
            selectedCentre === "ICTC Vashi" ? "active" : ""
          }`}
          onClick={() => setSelectedCentre("ICTC Vashi")}
        >
          <img src={tickIcon} alt="checked" />
          <span>ICTC Vashi</span>
        </div>

        <input
          type="date"
          className="appointment-date"
          placeholder="Select appointment date"
        />
      </div>


  <button className="book-btn">Book Appointment</button>
</div>


</section>


      </main>
    </section>
  );
};

export default DoctorProfile;
