import { useEffect, useState } from "react";
import "./HeroCarousel.css";

import slide1 from "../../../assets/slide img.png";
import slide2 from "../../../assets/slide img.png";
import slide3 from "../../../assets/slide img.png";

const slides = [slide1, slide2, slide3];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000); // 4 seconds

    return () => clearInterval(interval);
  }, []);

  const handleLocateCentre = () => {
    console.log("Locate Centre clicked");
  };

  const handleBookAppointment = () => {
    console.log("Book Appointment clicked");
  };

  const handleSecondOpinion = () => {
    console.log("Second Opinion clicked");
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

      {/* QUICK CTA BAR (STATIC) */}
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
