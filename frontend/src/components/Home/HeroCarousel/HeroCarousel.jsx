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

  const normalizeSlides = (raw) => {
    if (!Array.isArray(raw)) return [];
    return raw
      .map((item) => {
        if (typeof item === "string" && item.trim()) {
          const url = toImageUrl(item.trim());
          return { desktop: url, tablet: url, mobile: url };
        }
        if (item && typeof item === "object") {
          const desktop = toImageUrl(item.desktop);
          const tablet = toImageUrl(item.tablet || item.desktop);
          const mobile = toImageUrl(item.mobile || item.tablet || item.desktop);
          if (!desktop && !tablet && !mobile) return null;
          return {
            desktop: desktop || tablet || mobile,
            tablet: tablet || desktop || mobile,
            mobile: mobile || tablet || desktop,
          };
        }
        return null;
      })
      .filter(Boolean);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("/others");
        const payload = res?.data?.data ?? res?.data ?? {};
        const slidesFromApi = normalizeSlides(payload.carousel);
        if (slidesFromApi.length) {
          setSlides(slidesFromApi);
        } else {
          setSlides(defaultSlides);
        }
      } catch {
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
    <div className="hero-carousel-shell">
      <section className="hero-carousel">
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

      </section>

      {/* Desktop / tablet CTA — fixed to viewport */}
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
    </div>
  );
};

export default HeroCarousel;
