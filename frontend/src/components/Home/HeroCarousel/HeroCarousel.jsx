import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HeroCarousel.css";

import slide1 from "../../../assets/slide img.png";
import slide2 from "../../../assets/slide img.png";
import slide3 from "../../../assets/slide img.png";

const slides = [slide1, slide2, slide3];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  /* CTA HANDLERS */
  const handleLocateCentre = () => {
    navigate("/allCenters");
  };

  const handleBookAppointment = () => {
    navigate("/BookAppoinment");
  };

  const handleSecondOpinion = () => {
    navigate("/BookSecondOpinion");
  };

  return (
    <section className="hero-carousel">
      {/* IMAGE SLIDER */}
      {slides.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Hero slide ${index + 1}`}
          className={`hero-image ${index === current ? "active" : ""}`}
        />
      ))}

      {/* QUICK CTA BAR */}
      <div className="quick-cta">
        <button className="cta-btn light" onClick={handleLocateCentre}>
          Locate Centre <span>→</span>
        </button>

        <button className="cta-btn white" onClick={handleBookAppointment}>
          Book an Appointment <span>→</span>
        </button>

        <button className="cta-btn grey" onClick={handleSecondOpinion}>
          Get Second Opinion <span>→</span>
        </button>
      </div>
    </section>
  );
};

export default HeroCarousel;
