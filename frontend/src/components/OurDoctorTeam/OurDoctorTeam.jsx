import "./OurDoctorTeam.css";
import { useState } from "react";

/* IMAGES */
import doc1 from "../../assets/doc1.png";
import doc2 from "../../assets/doc2.png";
import doc3 from "../../assets/doc3.png";
import doc4 from "../../assets/doc1.png";
import doc5 from "../../assets/doc2.png";
import doc6 from "../../assets/doc3.png";
import doc7 from "../../assets/doc1.png";

import arrowIcon from "../../assets/cuida_dropdown-outline.png";

const doctors = [
  {
    name: "Dr. Salil Patkar",
    img: doc1,
    desc:
      "MBBS. MD. DM (Medical Oncology) Director. Consultant Oncologist Apollo Hospital. Certified in Immuno-Oncology and Precision Oncology – Harvard Medical School.",
    tag: "Oncologist & Haematologist",
  },
  {
    name: "Dr. Amit Ghanekar",
    img: doc2,
    desc:
      "MD, DNB (Oncology) ESMO Certified Cancer Specialist HEMAT – Oncologist BMT Physician",
    tag: "Cancer & Blood Specialist",
  },
  {
    name: "Dr. Rohit Pai",
    img: doc3,
    desc:
      "MD Medicine (AIIMS) DM Medical Oncology (AIIMS) MRCP (UK), DNB, ECMO",
    tag: "Medico Oncologist & Hemato Oncologist",
  },
  {
    name: "Dr. Viraj Nevrekar",
    img: doc4,
    desc:
      "MD Medicine (AIIMS, New Delhi) DM Medical Oncology (AIIMS, New Delhi) ECMO",
    tag: "Oncologist & Haematologist",
  },
  {
    name: "Dr. Kunal Goyal",
    img: doc5,
    desc:
      "MD, DM Clinical Hematology, Hemato-oncologist, BMT & CAR-T specialist",
    tag: "Hematologist & BMT Specialist",
  },
  {
    name: "Dr. Deep Vora",
    img: doc6,
    desc:
      "MBBS, DNB (Medicine), DM (Medical Oncology) MRCP SCE (UK)",
    tag: "Oncologist & Immuno-Oncologist",
  },
  {
    name: "Dr. Shreya Gattani",
    img: doc7,
    desc:
      "MBBS, MD, DM Medical Oncology (GCRI) Fellowship in Geriatric Oncology",
    tag: "Medical Oncologist",
  },
];

const faqs = [
  {
    question: "Can chemotherapy be used to treat cancer?",
    answer:
      "Most patients don’t feel any pain while receiving treatment, especially if they’re taking tablets or using cream topically. When the needle is inserted for a shot or injection, you can experience an unpleasant sting or prick.",
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
  return (
    <>
    <section className="our-doctor-team">
      <h2 className="our-doctor-team-title">Our Doctor Team</h2>

        <div className="our-doctor-team-grid">
        {doctors.map((doc, index) => (
          <div className="doctor-card-home" key={index}>
            
            {/* IMAGE + HOVER */}
            <div className="doctor-img-wrapper">
              <img src={doc.img} alt={doc.name} />

              <div className="doctor-hover">
                <button className="view-profile-btn">
                  View Complete Profile <span>→</span>
                </button>
              </div>
            </div>

            {/* CONTENT */}
            <div className="doctor-content">
              <h3>{doc.name}</h3>
              <p>{doc.desc}</p>
            </div>

            {/* TAG */}
            <div className="doctor-tag">{doc.tag}</div>
          </div>
        ))}
      </div>

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

    </>
  );
};

export default OurDoctorTeam;
