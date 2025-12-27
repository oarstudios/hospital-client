import { useState } from "react";
import "./ServicePage.css";

/* IMAGES */
import heroImg from "../../assets/serviceHero.png";
import contentImg1 from "../../assets/service1.png";
import contentImg2 from "../../assets/service2.png";
import arrowIcon from "../../assets/cuida_dropdown-outline.png";

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

const ServicePage = () => {
  const [activeIndex, setActiveIndex] = useState(2);

  return (
    <section className="ictc-service-page">
      {/* HERO CARD */}
      <div className="ictc-service-hero-card">
        <img src={heroImg} alt="Chemotherapy at ICTC" />
        <div className="ictc-service-hero-title">
          Chemotherapy at ICTC
        </div>
      </div>

      {/* CONTENT */}
      <div className="ictc-service-content">
        <h3>
          Chemotherapy employs drugs to eradicate cancer cells.
        </h3>

        <p>
          With this specific cancer therapy, cancer cells are prevented from
          multiplying, dividing, and generating new cells. A number of cancers
          can be treated using chemotherapy.
        </p>

        <p>
          The medicine chemotherapy has an overall body-wide impact. This
          implies that it circulates throughout the body via the bloodstream.
        </p>

        <img src={contentImg1} alt="Doctor consultation" />

        <h3>Subtypes of therapy</h3>
        <ul>
          <li>Adjuvant therapy</li>
          <li>Curative therapy</li>
          <li>Neoadjuvant therapy</li>
          <li>Palliative therapy</li>
        </ul>

        <h3>Benefits of chemotherapy</h3>
        <ul>
          <li>Shrinks or eliminates tumors</li>
          <li>Helps prevent cancer recurrence</li>
          <li>Allows surgery to remove malignancy</li>
        </ul>

        <img src={contentImg2} alt="Patient care" />

        <h3>Downside of chemotherapy</h3>
        <ul>
          <li>Hair loss</li>
          <li>Nausea and vomiting</li>
          <li>Fatigue</li>
          <li>Weak immune system</li>
        </ul>
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

export default ServicePage;
