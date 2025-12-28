import "./OurDoctorTeam.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import doctorData from "../../data/doctorData";
import arrowIcon from "../../assets/cuida_dropdown-outline.png";

const faqs = [
  {
    question: "Can chemotherapy be used to treat cancer?",
    answer:
      "Most patients don’t feel any pain while receiving treatment, especially if they’re taking tablets or using cream topically.",
  },
  {
    question: "Does receiving chemotherapy hurt?",
    answer:
      "Chemotherapy itself does not usually cause pain. Some discomfort may occur due to IV insertion or side effects.",
  },
  {
    question: "What stage of cancer receives chemotherapy treatment?",
    answer:
      "Chemotherapy can be used in early, advanced, or metastatic stages depending on treatment goals.",
  },
];

const OurDoctorTeam = () => {
  const [activeIndex, setActiveIndex] = useState(2);
  const navigate = useNavigate();

  const doctors = Object.values(doctorData);

  return (
    <section className="our-doctor-team">
      <h2 className="our-doctor-team-title">Our Doctor Team</h2>

      {/* DOCTOR GRID */}
      <div className="our-doctor-team-grid">
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

      {/* FAQ */}
      <div className="ictc-service-faq">
        <h2>FAQ’s</h2>

        {faqs.map((faq, index) => {
          const isActive = activeIndex === index;

          return (
            <div
              key={index}
              className={`ictc-faq-item ${
                isActive ? "ictc-faq-active" : ""
              }`}
              onClick={() =>
                setActiveIndex(isActive ? -1 : index)
              }
            >
              <div className="ictc-faq-question">
                <span>{faq.question}</span>
                <img
                  src={arrowIcon}
                  className={isActive ? "rotate" : ""}
                  alt="toggle"
                />
              </div>

              {isActive && (
                <div className="ictc-faq-answer">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default OurDoctorTeam;
