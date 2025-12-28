import { useState } from "react";
import { useParams } from "react-router-dom";
import "./ServicePage.css";

/* DATA */
import serviceData from "../../data/serviceData";

/* IMAGES (STATIC – SAME FOR ALL SERVICES) */
import heroImg from "../../assets/serviceHero.png";
import contentImg1 from "../../assets/service1.png";
import contentImg2 from "../../assets/service2.png";
import arrowIcon from "../../assets/cuida_dropdown-outline.png";

/* FAQ (can be made dynamic later if needed) */
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
  const { slug } = useParams();

  const data = serviceData[slug];

  /* SAFETY CHECK */
  if (!data) {
    return (
      <section className="ictc-service-page">
        <h2 style={{ padding: "40px" }}>
          Service details not found
        </h2>
      </section>
    );
  }

  return (
    <section className="ictc-service-page">
      {/* HERO CARD */}
      <div className="ictc-service-hero-card">
        <img src={heroImg} alt={data.heroTitle} />
        <div className="ictc-service-hero-title">
          {data.heroTitle}
        </div>
      </div>

      {/* CONTENT */}
      <div className="ictc-service-content">
        <h3>{data.description[0]}</h3>

        {data.description.slice(1).map((para, index) => (
          <p key={index}>{para}</p>
        ))}

        <img src={contentImg1} alt="Doctor consultation" />

        <h3>Subtypes of therapy</h3>
        <ul>
          {data.subtypes.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h3>Benefits of {data.name}</h3>
        <ul>
          {data.benefits.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <img src={contentImg2} alt="Patient care" />

        <h3>Downside of {data.name}</h3>
        <ul>
          {data.downsides.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
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
