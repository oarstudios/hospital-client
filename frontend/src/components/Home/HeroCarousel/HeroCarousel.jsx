import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../app/axiosinstance";
import "./HeroCarousel.css";

import slide1Desktop from "../../../assets/car.webp";
import slide1Tablet from "../../../assets/car_tab.webp";
import slide1Mobile from "../../../assets/car_mob.webp";
import slide2Desktop from "../../../assets/car2.webp";
import slide2Tablet from "../../../assets/car2_tab.webp";
import slide2Mobile from "../../../assets/car2_mob.webp";

const defaultSlides = [
  { desktop: slide1Desktop, tablet: slide1Tablet, mobile: slide1Mobile },
  { desktop: slide2Desktop, tablet: slide2Tablet, mobile: slide2Mobile },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [showCTA, setShowCTA] = useState(true);
  const [slides, setSlides] = useState(defaultSlides);
  const navigate = useNavigate();

  const toImageUrl = (name) => {
    if (!name) return "";
    if (name.startsWith("http://") || name.startsWith("https://")) return name;
    const base = (axios.defaults.baseURL || "").replace(/\/$/, "");
    const normalized = name.startsWith("/uploads/") ? name : `/uploads/${name}`;
    return `${base}${normalized}`;
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("/others");
        const payload = res?.data?.data ?? res?.data ?? {};
        const carousel = Array.isArray(payload.carousel) ? payload.carousel : [];
        if (carousel.length) {
          const slidesFromApi = carousel.map((name) => {
            const url = toImageUrl(name);
            return { desktop: url, tablet: url, mobile: url };
          });
          setSlides(slidesFromApi);
        } else {
          setSlides(defaultSlides);
        }
      } catch (err) {
        setSlides(defaultSlides);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="hero-carousel">
      {/* SLIDES */}
      {slides.map((slide, index) => (
        <picture
          key={index}
          className={`hero-image ${index === current ? "active" : ""}`}
        >
          <source media="(max-width: 767px)" srcSet={slide.mobile} />
          <source media="(max-width: 1024px)" srcSet={slide.tablet} />
          <img src={slide.desktop} alt={`Hero slide ${index + 1}`} />
        </picture>
      ))}

      {/* QUICK CTA */}
      {showCTA && (
        <div className="quick-cta">
          <button className="cta-close" onClick={() => setShowCTA(false)}>
            ✕
          </button>

          <button className="cta-btn light" onClick={() => navigate("/allCenters")}>
            Locate Centre <span>→</span>
          </button>

          <button className="cta-btn white" onClick={() => navigate("/BookAppoinment")}>
            Book an Appointment <span>→</span>
          </button>

          <button className="cta-btn grey" onClick={() => navigate("/BookSecondOpinion")}>
            Get Second Opinion <span>→</span>
          </button>
        </div>
      )}
    </section>
  );
};

export default HeroCarousel;
