import { useRef } from "react";
import "./MeetOurExperts.css";
import doc1 from "../../../assets/doc1.png";
import doc2 from "../../../assets/doc2.png";
import doc3 from "../../../assets/doc3.png";

/* Replace image paths later */
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
    name: "Dr. Salil Patkar",
    img: doc1,
    desc: "MBBS, MD, DM (Medical Oncology) Director...",
    tag: "Oncologist & Haematologist",
  },
  {
    name: "Dr. Amit Ghanekar",
    img: doc2,
    desc: "MD, DNB (Oncology) ESMO Certified...",
    tag: "Cancer & Blood Specialist",
  },
  {
    name: "Dr. Rohit Pai",
    img: doc3,
    desc: "MD Medicine (AIIMS) DM Medical Oncology...",
    tag: "Medico Oncologist & Hemato Oncologist",
  },
];

const MeetOurExperts = () => {
  const sliderRef = useRef(null);

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
        {doctors.map((doc, index) => (
          <div className="doctor-card" key={index}>
            
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
    </section>
  );
};

export default MeetOurExperts;
