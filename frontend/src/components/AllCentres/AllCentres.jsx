import "./AllCentres.css";
import { useNavigate } from "react-router-dom";
import centerData from "../../data/centerData";

/* ICONS */
import callIcon from "../../assets/fluent_call-12-filled.png";
import starIcon from "../../assets/RatingFill.png";
import starHalfIcon from "../../assets/RatingNotFill.png";

const AllCentres = () => {
  const navigate = useNavigate();

  return (
    <section className="ictc-centres-page">
      <h2 className="ictc-centres-title">ICTC Cancer Care Centres</h2>

      <div className="ictc-centres-list">
        {Object.values(centerData).map((centre) => (
          <article className="ictc-centre-card" key={centre.slug}>
            
            {/* MAP */}
            <div className="ictc-centre-map">
              <iframe
                title={`${centre.name} map`}
                src={centre.mapEmbed}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* INFO */}
            <div className="ictc-centre-info">
              <div className="ictc-centre-header">
                <h3>{centre.name}</h3>

                <button
                  className="appointment-btn"
                  onClick={() => navigate(`/centre/${centre.slug}`)}
                >
                  BOOK APPOINTMENT
                </button>
              </div>

              {/* RATING */}
              <div className="ictc-centre-rating">
                <img src={starIcon} alt="rating" />
                <img src={starIcon} alt="rating" />
                <img src={starIcon} alt="rating" />
                <img src={starIcon} alt="rating" />
                <img src={starHalfIcon} alt="rating" />

                <span className="rating-score">{centre.rating}</span>
                <span className="rating-sep">|</span>
                <span className="rating-count">{centre.reviews}</span>
              </div>

              {/* ADDRESS */}
              <p className="ictc-centre-address">
                {centre.address}
              </p>

              {/* FOOTER */}
              <div className="ictc-centre-footer">
                <div className="ictc-centre-phone">
                  <img src={callIcon} alt="Call" />
                  <a href={`tel:${centre.phone.replace(/\s/g, "")}`}>
                    {centre.phone}
                  </a>
                </div>

                <span className="ictc-centre-time">
                  {centre.timing}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default AllCentres;
