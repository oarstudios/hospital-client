import { useState } from "react";
import { useParams } from "react-router-dom";
import "./ServicePage.css";

/* DATA */
import serviceData from "../../data/serviceData";

/* ICON */
import arrowIcon from "../../assets/cuida_dropdown-outline.png";

/* UTIL HELPERS */
const formatTitle = (text) =>
  text
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());

const renderArray = (arr) => (
  <ul>
    {arr.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
);

const renderObject = (obj) =>
  Object.entries(obj).map(([key, value]) => (
    <div key={key} className="ictc-service-section">
      <h4>{formatTitle(key)}</h4>

      {Array.isArray(value) && renderArray(value)}

      {typeof value === "object" &&
        !Array.isArray(value) &&
        Object.entries(value).map(([subKey, subValue]) => (
          <div key={subKey} className="ictc-service-subsection">
            <h5>{formatTitle(subKey)}</h5>
            {Array.isArray(subValue) && renderArray(subValue)}
          </div>
        ))}
    </div>
  ));

const ServicePage = () => {
  const { slug } = useParams();
  const data = serviceData[slug];
  const [activeIndex, setActiveIndex] = useState(null);

  if (!data) {
    return (
      <section className="ictc-service-page">
        <h2 style={{ padding: "40px" }}>Service details not found</h2>
      </section>
    );
  }

  return (
    <section className="ictc-service-page">
      {/* HERO */}
      <div className="ictc-service-hero-card">
        <img src={data.heroImage} alt={data.heroTitle} />
        <div className="ictc-service-hero-title">
          {data.heroTitle}
        </div>
      </div>

      {/* INTRO */}
      {data.introduction && (
        <p className="ictc-service-intro">{data.introduction}</p>
      )}

      {/* CONTENT */}
      <div className="ictc-service-content">
        {/* FIRST CONTENT IMAGE */}
        {data.contentImages?.[0] && (
          <img
            src={data.contentImages[0]}
            alt={`${data.name} treatment`}
          />
        )}

        {Object.entries(data).map(([key, value]) => {
          if (
            [
              "name",
              "heroTitle",
              "heroImage",
              "contentImages",
              "introduction",
              "faqs",
            ].includes(key)
          )
            return null;

          if (Array.isArray(value)) {
            return (
              <section key={key}>
                <h3>{formatTitle(key)}</h3>
                {renderArray(value)}
              </section>
            );
          }

          if (typeof value === "object") {
            return (
              <section key={key}>
                <h3>{formatTitle(key)}</h3>
                {renderObject(value)}
              </section>
            );
          }

          return null;
        })}

        {/* SECOND CONTENT IMAGE */}
        {data.contentImages?.[1] && (
          <img
            src={data.contentImages[1]}
            alt={`${data.name} care`}
          />
        )}
      </div>

      {/* FAQ */}
      {data.faqs?.length > 0 && (
        <div className="ictc-service-faq">
          <h2>FAQ’s</h2>

          {data.faqs.map((faq, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={index}
                className={`ictc-faq-item ${
                  isActive ? "ictc-faq-active" : ""
                }`}
                onClick={() =>
                  setActiveIndex(isActive ? null : index)
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
      )}
    </section>
  );
};

export default ServicePage;
