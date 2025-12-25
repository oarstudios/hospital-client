import "./ExpertsAtICTC.css";
import drSalil from "../../../assets/doc1.png";
import drKunal from "../../../assets/doc2.png";

const doctors = [
  {
    name: "Dr. Salil Patkar",
    image: drSalil,
    tag: "Oncologist & Haematologist",
    shortInfo:
      "MBBS. MD. DM (Medical Oncology) Director. Consultant Oncologist Apollo Hospital. Certified in Immuno-Oncology and Precision Oncology – Harvard Medical School.",
    description: [
      "Dr Salil Patkar offers comprehensive care for all types of cancer under one roof. He is certified in Immuno-Oncology and Precision Oncology from Harvard Medical School. He specializes in the management of blood cancers, breast cancer, prostate cancer, lung cancer, & other oncological conditions.",
      "Dr. Patkar is an expert in chemotherapy, molecular targeted therapy, hormonal therapy, and immunotherapy, providing advanced and personalized cancer treatment for every patient. He is the leading oncologist at ICTC Vashi & ICTC Panvel, known for his compassionate approach, precision treatment, and commitment to patient care."
    ]
  },
  {
    name: "Dr. Kunal Goyal",
    image: drKunal,
    tag: "Hematologist, Bone Marrow Transplant & Cellular Therapy Specialist",
    shortInfo:
      "MD, DM Clinical Haematology, Haemato-oncologist, BMT and cellular therapies (CAR-T) specialist.",
    description: [
      "Dr. Kunal Goyal has over 6 years of experience in clinical haematology, performing 200+ bone marrow transplants and contributing to CAR-T cell therapy trials at Tata Memorial Centre.",
      "He specializes in bone marrow transplantation, CAR-T cell therapy, and treating leukemia, lymphoma, myelodysplastic syndromes, and coagulation disorders, with expertise in advanced cellular therapies."
    ]
  }
];

const ExpertsAtICTC = () => {
  return (
    <section className="experts-section-dark">
      <h2 className="experts-heading">Experts at ICTC</h2>

      {doctors.map((doc, index) => (
        <div
          key={index}
          className={`expert-row ${index % 2 !== 0 ? "reverse" : ""}`}
        >
          {/* DOCTOR CARD (re-used style) */}
          <div className="expert-card">
            <div className="expert-img">
              <img src={doc.image} alt={doc.name} />
            </div>

            <h3>{doc.name}</h3>
            <p className="expert-short">{doc.shortInfo}</p>

            <div className="expert-tag">{doc.tag}</div>
          </div>

          {/* CONTENT */}
          <div className="expert-content">
            <h3>{doc.name}</h3>

            {doc.description.map((para, i) => (
              <p key={i}>{para}</p>
            ))}

            <span className="know-more">
              Know More <span>→</span>
            </span>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ExpertsAtICTC;
