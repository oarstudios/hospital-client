import "./OurCenterHero.css";
import phoneIcon from "../../../assets/call (2).png";
import locationIcon from "../../../assets/weui_location-filled.png";
import starIcon from "../../../assets/Hearts.png";
import { useParams } from "react-router-dom";
import centerData from "../../../data/centerData";

const OurCenterHero = () => {
  const { slug } = useParams();

  const center = centerData[slug];

  if (!center) return null;

  return (
    <section className="our-center-hero">
      {/* HERO IMAGE */}
      <div
        className="hero-banner"
        style={{ backgroundImage: `url(${center.heroBg})` }}
      />

      {/* INFO SECTION */}
      <div className="center-info">
        <h2>{center.fullName}</h2>

        {/* RATING */}
        <div className="rating-row">
          <div className="stars">
            {[1, 2, 3, 4, 5].map((i) => (
              <img key={i} src={starIcon} alt="star" />
            ))}
            {/* <img src={starIcon} alt="half-star" className="dim" /> */}
          </div>

          <span className="rating-text">
            {center.rating}
            <span className="divider"> | </span>
            {center.reviews}
          </span>
        </div>

        {/* PHONE */}
        <div className="contact-row">
          <img src={phoneIcon} alt="phone" />
          <span className="phone">{center.phone}</span>
        </div>

        {/* ADDRESS */}
        <div className="address-block">
          <div className="address-title">
            <img src={locationIcon} alt="location" />
            <span className="addTitle">Address:</span>
          </div>

          <p className="address-text">{center.address}</p>
        </div>

        {/* TIMING */}
        <p className="timing">{center.timing}</p>
      </div>
    </section>
  );
};

export default OurCenterHero;
