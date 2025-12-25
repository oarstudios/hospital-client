import "./WhyChooseICTC.css";

import imgAffordable from "../../../assets/whyUs1.png";
import imgLargest from "../../../assets/whyUs2.png";
import imgExpertise from "../../../assets/whyUs3.png";
import imgPatient from "../../../assets/whyUs4.png";

const cards = [
  {
    title: "Affordable\nCancer Care",
    text: "We are founded on the principle that high-quality cancer care should be within everyone's reach.",
    image: imgAffordable,
  },
  {
    title: "Mumbai's Largest and Most Accessible Cancer Care Chain.",
    text: "With an extensive network of centres across Mumbai, ICTC brings world-class cancer care closer to you.",
    image: imgLargest,
  },
  {
    title: "Unmatched Expertise from Premier Institutions.",
    text: "Our team is led by distinguished oncologists with training and experience from India's top institutions.",
    image: imgExpertise,
  },
  {
    title: "Patient-Centric Care.",
    text: "We go beyond just medical treatment, providing complete patient support including diagnostics, chemotherapy, counselling, and nutritional advice.",
    image: imgPatient,
  },
];

const WhyChooseICTC = () => {
  return (
    <section className="why-ictc">
      <h2 className="why-title">Why Choose ICTC</h2>

      <div className="why-grid">
        {cards.map((card, index) => (
          <div className="why-card" key={index}>
            <div className="why-card-content">
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>

            <div className="why-card-image">
              <img src={card.image} alt={card.title} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseICTC;
