import "./OurCenterHero.css";
import heroBg from "../../../assets/Frame 87.png";
import phoneIcon from "../../../assets/call (2).png";
import locationIcon from "../../../assets/weui_location-filled.png";
import starIcon from "../../../assets/Hearts.png";

/* 🔹 Dynamic centre data */
const centerData = {
  name: "ICTC Vashi Centre",
  rating: "4.9",
  reviews: "150+ Ratings",
  phone: "+91 88588 55200",
  address:
    "3rd floor, Mahavir Center, Office 47/48, above Golden Punjab Hotel, Sec-17 Road, Sector 17, Vashi, Navi Mumbai, Maharashtra 400703",
  timing: "Mon – Sat 9:00 a.m. to 7:00 p.m.",
};

const OurCenterHero = () => {
  return (
    <section className="our-center-hero">
      {/* HERO IMAGE */}
      <div
        className="hero-banner"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* INFO SECTION */}
      <div className="center-info">
        <h2>{centerData.name}</h2>

        {/* RATING */}
        <div className="rating-row">
          <div className="stars">
            {[1, 2, 3, 4].map((i) => (
              <img key={i} src={starIcon} alt="star" />
            ))}
            <img src={starIcon} alt="half-star" className="dim" />
          </div>

          <span className="rating-text">
            {centerData.rating}
            <span className="divider"> | </span>
            {centerData.reviews}
          </span>
        </div>

        {/* PHONE */}
        <div className="contact-row">
          <img src={phoneIcon} alt="phone" />
          <span className="phone">{centerData.phone}</span>
        </div>

        {/* ADDRESS (NEW LINE FIX) */}
        <div className="address-block">
          <div className="address-title">
            <img src={locationIcon} alt="location" />
            <span className="addTitle">Address:</span>
          </div>

          <p className="address-text">{centerData.address}</p>
        </div>

        {/* TIMING */}
        <p className="timing">{centerData.timing}</p>
      </div>
    </section>
  );
};

export default OurCenterHero;
